import { NextResponse } from 'next/server';
import { Neo4jService } from '@/services/neo4j';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { UploadedFile } from '@/types/file';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nodesFile = formData.get('nodes') as File;
    const relationshipsFile = formData.get('relationships') as File;

    console.log('Received upload request:', {
      nodesFileName: nodesFile?.name,
      nodesFileSize: nodesFile?.size,
      relationshipsFileName: relationshipsFile?.name,
      relationshipsFileSize: relationshipsFile?.size
    });

    if (!nodesFile || !relationshipsFile) {
      const missingFiles = [];
      if (!nodesFile) missingFiles.push('nodes');
      if (!relationshipsFile) missingFiles.push('relationships');
      return NextResponse.json(
        { error: `Missing required files: ${missingFiles.join(', ')}` },
        { status: 400 }
      );
    }

    // Save files temporarily
    const nodesPath = join(tmpdir(), 'nodes.csv');
    const relationshipsPath = join(tmpdir(), 'relationships.csv');

    console.log('Saving files temporarily:', { nodesPath, relationshipsPath });

    await writeFile(nodesPath, Buffer.from(await nodesFile.arrayBuffer()));
    await writeFile(relationshipsPath, Buffer.from(await relationshipsFile.arrayBuffer()));

    const nodesUploadedFile: UploadedFile = {
      path: nodesPath,
      filename: nodesFile.name,
      size: nodesFile.size,
      mimetype: nodesFile.type
    };

    const relationshipsUploadedFile: UploadedFile = {
      path: relationshipsPath,
      filename: relationshipsFile.name,
      size: relationshipsFile.size,
      mimetype: relationshipsFile.type
    };

    const neo4jService = new Neo4jService();

    // First, validate file formats
    console.log('Validating file formats...');
    const nodesValidation = await neo4jService.validateNodesCsv(nodesUploadedFile);
    const relationshipsValidation = await neo4jService.validateRelationshipsCsv(relationshipsUploadedFile);

    if (!nodesValidation.isValid || !relationshipsValidation.isValid) {
      return NextResponse.json({
        error: 'CSV validation failed',
        nodesErrors: nodesValidation.errors,
        relationshipsErrors: relationshipsValidation.errors
      }, { status: 400 });
    }

    // Then, validate data consistency
    console.log('Validating data consistency...');
    const consistencyValidation = await neo4jService.validateDataConsistency(
      nodesUploadedFile,
      relationshipsUploadedFile
    );

    if (!consistencyValidation.isValid) {
      return NextResponse.json({
        error: 'Data consistency validation failed',
        details: consistencyValidation.errors,
        stats: consistencyValidation.stats
      }, { status: 400 });
    }

    console.log('Data consistency validation stats:', consistencyValidation.stats);

    // Initialize database schema
    await neo4jService.init();

    // Upload data
    await neo4jService.uploadNodes(nodesUploadedFile);
    await neo4jService.uploadRelationships(relationshipsUploadedFile);

    return NextResponse.json({ 
      success: true,
      stats: consistencyValidation.stats
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}