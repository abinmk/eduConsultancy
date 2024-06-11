import pdfplumber
import json

# Path to the PDF file
pdf_path = 'data.pdf'

# Function to clean the text
def clean_text(text):
    if text:
        return ' '.join(text.split())
    return ''

# Extract specific columns from the table
def extract_specific_columns(table):
    headers = [clean_text(header) for header in table[0]]
    data = []
    for row in table[1:]:
        cleaned_row = [clean_text(cell) for cell in row]
        if len(cleaned_row) > 1 and cleaned_row[0].isdigit():  # Ensure the first column is a number (SNo)
            entry = {
                'Rank': cleaned_row[1],  # Assuming 'Rank' is the second column
                'Allotted Quota': cleaned_row[2],  # Assuming 'Allotted Quota' is the third column
                'Allotted Institute': cleaned_row[3],  # Assuming 'Allotted Institute' is the fourth column
                'Course': cleaned_row[4]  # Assuming 'Course' is the fifth column
            }
            data.append(entry)
    return data

# Open the PDF and extract the tables
tables = []
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        extracted_tables = page.extract_tables()
        for table in extracted_tables:
            if table:
                tables.append(table)

# Convert extracted tables to JSON-compatible format
json_data = []
for table in tables:
    json_data.extend(extract_specific_columns(table))

# Save the data to a JSON file
json_path = 'results.json'
with open(json_path, 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

print(f"Data successfully saved to {json_path}")
