import { v4 as uuidv4 } from 'uuid';

// Types for FHIR resources
interface FhirResource {
  resourceType: string;
  id?: string;
  [key: string]: any;
}

interface FhirBundle {
  resourceType: 'Bundle';
  type: 'document' | 'message' | 'transaction' | 'batch' | 'collection' | 'history' | 'searchset' | 'transaction-response' | 'batch-response';
  entry?: Array<{
    resource: FhirResource;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ProcessingResult {
  success: boolean;
  error?: string;
  bundleId?: string;
}

// Validate FHIR Bundle structure
export function validateBundle(bundle: any): ValidationResult {
  // Check if it's a valid bundle
  if (!bundle || typeof bundle !== 'object') {
    return { isValid: false, error: 'Not a valid JSON object' };
  }

  // Check resourceType
  if (bundle.resourceType !== 'Bundle') {
    return { isValid: false, error: 'Not a FHIR Bundle (missing or incorrect resourceType)' };
  }

  // Check bundle type
  const validTypes = ['document', 'message', 'transaction', 'batch', 'collection', 'history', 'searchset', 'transaction-response', 'batch-response'];
  if (!bundle.type || !validTypes.includes(bundle.type)) {
    return { isValid: false, error: 'Invalid or missing bundle type' };
  }

  // Check entries
  if (!bundle.entry || !Array.isArray(bundle.entry)) {
    return { isValid: false, error: 'Bundle missing entries array' };
  }

  // Check each entry has a resource
  for (let i = 0; i < bundle.entry.length; i++) {
    const entry = bundle.entry[i];
    if (!entry.resource || typeof entry.resource !== 'object') {
      return { isValid: false, error: `Entry ${i} missing resource` };
    }

    if (!entry.resource.resourceType) {
      return { isValid: false, error: `Entry ${i} resource missing resourceType` };
    }
  }

  return { isValid: true };
}

// Process the bundle (store, validate dual coding, etc.)
export async function processBundle(bundle: FhirBundle): Promise<ProcessingResult> {
  try {
    // Generate a unique ID for this bundle
    const bundleId = uuidv4();
    
    // Extract and validate resources
    const resources = bundle.entry?.map(entry => entry.resource) || [];
    
    // Check for required resources
    const hasPatient = resources.some(r => r.resourceType === 'Patient');
    if (!hasPatient) {
      return { success: false, error: 'Bundle must contain at least one Patient resource' };
    }

    // Validate dual coding for Condition resources
    const conditionResources = resources.filter(r => r.resourceType === 'Condition');
    for (const condition of conditionResources) {
      const codingValidation = validateDualCoding(condition);
      if (!codingValidation.isValid) {
        return { success: false, error: `Condition ${condition.id} validation failed: ${codingValidation.error}` };
      }
    }

    // In a real implementation, you would:
    // 1. Store the bundle in your database
    // 2. Process each resource individually
    // 3. Create audit logs
    // 4. Handle transactions appropriately
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just return success
    console.log(`Processed bundle ${bundleId} with ${resources.length} resources`);
    
    return { success: true, bundleId };
  } catch (error) {
    console.error('Error processing bundle:', error);
    return { success: false, error: 'Failed to process bundle' };
  }
}

// Validate dual coding (NAMASTE + ICD-11) for Condition resources
function validateDualCoding(condition: any): ValidationResult {
  if (!condition.code || !condition.code.coding) {
    return { isValid: false, error: 'Missing coding information' };
  }

  const codings = condition.code.coding;
  const hasNamaste = codings.some((coding: any) => 
    coding.system && coding.system.includes('namaste')
  );
  const hasIcd11 = codings.some((coding: any) => 
    coding.system && (coding.system.includes('icd-11') || coding.system === 'http://hl7.org/fhir/sid/icd-11')
  );

  if (!hasNamaste) {
    return { isValid: false, error: 'Missing NAMASTE coding' };
  }

  if (!hasIcd11) {
    return { isValid: false, error: 'Missing ICD-11 coding' };
  }

  return { isValid: true };
}