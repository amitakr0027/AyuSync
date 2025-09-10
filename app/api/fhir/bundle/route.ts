import { NextRequest, NextResponse } from 'next/server';
import { validateBundle, processBundle } from '@/lib/fhir/bundle-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('bundle') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== 'application/json') {
      return NextResponse.json(
        { error: 'Only JSON files are accepted' },
        { status: 400 }
      );
    }

    // Read and parse the file
    const fileContent = await file.text();
    let bundle;
    
    try {
      bundle = JSON.parse(fileContent);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate the bundle structure
    const validationResult = validateBundle(bundle);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: `Invalid FHIR Bundle: ${validationResult.error}` },
        { status: 400 }
      );
    }

    // Process the bundle (store in database, validate dual coding, etc.)
    const processingResult = await processBundle(bundle);
    
    if (!processingResult.success) {
      return NextResponse.json(
        { error: processingResult.error },
        { status: 422 } // Unprocessable Entity
      );
    }

    return NextResponse.json(
      { 
        message: 'Bundle processed successfully',
        bundleId: processingResult.bundleId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Bundle upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}