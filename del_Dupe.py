import csv
import os

def remove_duplicate_rows(input_file, output_file):
    seen = set()

    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        rows = list(reader)

        if not rows:
            print("The file is empty.")
            return

        # Separate header and data rows
        header = rows[0]
        data_rows = rows[1:]

        # Deduplicate
        unique_rows = []
        for row in data_rows:
            row_tuple = tuple(row)
            if row_tuple not in seen:
                seen.add(row_tuple)
                unique_rows.append(row)

    # Write results
    with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        writer.writerows(unique_rows)

    print(f"Deduplication complete. {len(data_rows) - len(unique_rows)} duplicates removed.")

# Example usage
remove_duplicate_rows('headlines.csv', 'headlines.csv')
