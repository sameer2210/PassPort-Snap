export class LayoutError extends Error {
  readonly reason = 'LAYOUT_OPTIMIZER_ERROR';
  constructor(message: string) { super(message); }
}

export class ValidationError extends Error {
  readonly reason = 'VALIDATION_CONSTRAINT_FAILED';
  constructor(message: string) { super(message); }
}

export class RenderError extends Error {
  readonly reason = 'RENDER_COMPILE_ERROR';
  constructor(message: string) { super(message); }
}

export class ExportError extends Error {
  readonly reason = 'EXPORT_COMPILATION_ERROR';
  constructor(message: string) { super(message); }
}

export class PrintError extends Error {
  readonly reason = 'PRINT_DIALOG_ERROR';
  constructor(message: string) { super(message); }
}

export abstract class PrintSubsystemError extends Error {
  abstract readonly reason: string;
  abstract readonly recoverable: boolean;
  abstract readonly recommendedAction: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LayoutOverflowError extends PrintSubsystemError {
  readonly reason = 'LAYOUT_OVERFLOW';
  readonly recoverable = true;
  readonly recommendedAction = 'Choose a larger paper size or smaller photo template.';
}

export class InvalidPaperError extends PrintSubsystemError {
  readonly reason = 'INVALID_PAPER_SIZE';
  readonly recoverable = false;
  readonly recommendedAction = 'Re-select a valid paper size from the dashboard dropdown.';
}

export class InvalidTemplateError extends PrintSubsystemError {
  readonly reason = 'INVALID_PHOTO_TEMPLATE';
  readonly recoverable = false;
  readonly recommendedAction = 'Select a supported passport photo dimensions standard.';
}

export class ExportFailedError extends PrintSubsystemError {
  readonly reason = 'EXPORT_FAILED';
  readonly recoverable = true;
  readonly recommendedAction = 'Verify image resources are accessible and try downloading again.';
}

export class ImageDecodeError extends PrintSubsystemError {
  readonly reason = 'IMAGE_DECODE_FAILED';
  readonly recoverable = true;
  readonly recommendedAction = 'The uploaded photo file is corrupt. Please re-upload the original photo.';
}

export class PdfGenerationError extends PrintSubsystemError {
  readonly reason = 'PDF_GENERATION_FAILED';
  readonly recoverable = true;
  readonly recommendedAction = 'Re-verify grid slots and try exporting the PDF again.';
}

export class PrintFailedError extends PrintSubsystemError {
  readonly reason = 'PRINT_DIALOG_FAILED';
  readonly recoverable = true;
  readonly recommendedAction = 'Ensure your browser print configuration allows opening the popup print dialog.';
}

