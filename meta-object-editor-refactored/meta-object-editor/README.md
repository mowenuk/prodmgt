# Meta-Object & Relationship Editor

This project is a web-based application designed to manage meta-objects and their relationships. It provides a user-friendly interface for defining object types, relationships, and schema attributes, along with a preview feature to visualize the defined structures.

## Project Structure

- **src/**: Contains the source code for the application.
  - **components/**: HTML components that make up the user interface.
    - **controls.html**: Control buttons and dataset selection.
    - **tabs.html**: Navigation tabs for different sections.
    - **object-types.html**: Management of object types.
    - **relationships.html**: Management of relationships.
    - **schema.html**: Management of schema attributes.
    - **preview.html**: Preview section for selected attributes.
  - **styles/**: Contains CSS styles for the application.
    - **styles.css**: Styles defining the layout and visual aspects.
  - **scripts/**: JavaScript files for application functionality.
    - **main.js**: Main entry point for JavaScript.
    - **schema.js**: Functions for managing schema attributes.
    - **preview.js**: Functions for rendering the preview form.
    - **tabs.js**: Functions for managing tab switching.
  - **index.html**: Main entry point of the application.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd meta-object-editor
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the application, open `src/index.html` in a web browser. The application allows you to:

- Load and manage object types.
- Define and manage relationships between objects.
- Create and manage schema attributes.
- Preview the defined structures and their attributes.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.