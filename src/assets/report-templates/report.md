## Template JSON Structure Documentation

This document outlines the structure and properties of the JSON template used to generate PDF documents using pdfmake and custom logic.

### Essential Keys for Form Functionality

The following keys are integral to the functionality of the form and should not be deleted. If not needed, text can be left blank.

- **cover_page**: Determines whether the cover page is enabled.
- **cover_page_letter_head**: Specifies if a letterhead is included on the cover page.
- **title**: Title of the document.
- **info_header_text**: Header text displayed on the cover page.
- **info_cover_body_1**: Body content for the cover page.
- **info_cover_body_2**: Additional body content for the cover page.
- **reference**: Reference information displayed on the cover page.
- **info_cover_body_3**: More body content for the cover page.
- **info_cover_body_4**: Additional body content for the cover page.
- **info_cover_body_5**: More body content for the cover page.
- **location_date**: Location and date information displayed on the cover page.
- **info_cover_footer_1**: Footer content for the cover page.
- **info_cover_footer_2**: Additional footer content for the cover page.
- **info_cover_footer_3**: More footer content for the cover page.
- **project_name**: Name of the project.
- **project_description**: Description of the project.
- **userpassword**: Password required for accessing the document.
- **ownerpassword**: Password required for modifying the document.

### Settings

The settings object contains general configuration options for the PDF document.

- `userpassword` (string): Optional password for restricting user access to the PDF.
- `ownerpassword` (string): Password for owner access to the PDF.
- `pageSize` (string): Size of the pages, e.g., "A4".
- `pageMargins` (array): Margins for each page in the order of [left, top, right, bottom].
- `img_logo` (object): Configuration for the logo image.
- `img_background` (object): Configuration for the background image.
- `info_header_text` (object): Configuration for the header text.
- `global_style` (object): Global styles for different elements.
  - `title` (object): Style for the title text.
    - Properties: color, bold, fontSize, alignment, margin, etc..
  - `subtitle` (object): Style for the subtitle text.
    - Properties: color, bold, fontSize, alignment, margin, etc..
  - `text` (object): Style for regular text.
    - Properties: color, bold, fontSize, alignment, margin, etc..
  - `tables` (object): Styles for tables.
    - `tableHeader` (object): Style for table headers.
      - Properties: fillColor, border, margin, textTransform.

### Cover Page

The cover_page object contains configurations for the cover page of the document.

- `img_letterhead` (object): Configuration for the letterhead image.
  - Properties: enable, img_path, width, alignment, margin.
- `title` (object): Configuration for the title text.
  - Properties: text, color, bold, fontSize, alignment, margin, gapPos, gapLines.
- `info_cover_body_X` (object): Configuration for body text elements.
  - Properties: text, color, bold, fontSize, alignment, margin, gapPos, gapLines.
- `reference` (object): Configuration for the reference text.
  - Properties: text, color, bold, fontSize, alignment, margin.
- `location_date` (object): Configuration for the location and date text.
  - Properties: text, color, bold, fontSize, alignment, margin, gapPos, gapLines.
- `info_cover_footer_X` (object): Configuration for footer elements.
  - Properties: text, color, border, margin, fontSize, alignment.

To add additional titles or text, create a custom key name and use the same structure as the default json.

### Pages

The pages object contains configurations for the content pages of the document.

- `project_name` (object): Configuration for the project name text.
  - Properties: text, color, bold, fontSize, alignment, margin, gapPos, gapLines.
- `project_description` (object): Configuration for the project description text.
  - Properties: text, color, bold, fontSize, alignment, gapPos, gapLines.

To add additional titles or text, create a custom key name and use the same structure as the default json.

### Images

When working with your template, you can seamlessly integrate images into your pages or cover page. Below is the format to follow when adding images. Ensure that the images are stored in the directory `../../assets/img/`. You only need to specify the name and format of the image file, as it will be automatically base64 encoded.

```json
{
  "enable": true,
  "img_path": "logo.png",
  "width": 45,
  "margin": [35, 5, 0, 0]
}
```

- **enable**: Set this to `true` to enable the image.
- **img_path**: Specify the name and format of the image file, located in the `../../assets/img/` directory.
- **width**: Define the width of the image in the document.
- **margin**: Set the margins around the image. Use the format `[top, right, bottom, left]`.

Ensure that you correctly configure the image path and settings to display your desired images within your document.

### Custom Params

In addition to the standard parameters provided by pdfmake, there are some custom parameters specific to your template. These parameters offer additional customization options for your document layout and content. Below is an explanation of each custom parameter and how to use them:

- **img_path**: This parameter specifies the path to an image file. It is used in conjunction with the `enable` parameter to display images within your document. Ensure that the image file is located in the specified directory. Once located the image it will be base64 encoded.

- **startAt**: This parameter determines the page number at which a particular element should start appearing. For example, you can set `startAt: 2` to ensure that an element appears starting from page 2 onwards.

- **allpages**: When set to `true`, this parameter indicates that a specific element should appear on all pages of the document, regardless of the page number. Use this parameter to create headers, footers, or other recurring elements.

- **gapPos**: This parameter specifies the position of a gap (empty space) relative to the element. It can be set to `'top'` or `'bottom'` to indicate whether the gap should appear above or below the element, respectively.

- **gapLines**: This parameter determines the number of empty lines to be included as a gap. It is useful for creating spacing between elements or sections within your document.

To use these custom parameters, simply include them in the respective JSON objects within your template configuration. Adjust their values according to your layout and design requirements to achieve the desired document structure and appearance.

---

This documentation provides a comprehensive overview of the JSON structure for creating templates using pdfmake. Users can refer to this guide to understand the properties and configurations available for building custom PDF templates.
