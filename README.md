Invoice Bulk Edit Feature

Overview:
The Invoice Bulk Edit feature enhances the functionality of the application by introducing a new capability to edit multiple invoices simultaneously in an Excel-like table. 
Users can perform bulk edit operations, such as updating invoice details, and the changes are validated and stored in the Redux store.

Features:

1. New Bulk Edit Interface
Location: Accessible through a new button on the invoice list screen.
User Interaction: Clicking the button opens the bulk edit interface.
2. Bulk Editing
Selection: Users can select multiple invoices using checkboxes.
Excel-like Table: Utilizes a table interface, similar to Excel, for easy and intuitive editing.
Validation: The application validates changes made by users to ensure data integrity.
3. Redux Store Update
Real-time Update: Changes made during bulk editing are promptly updated in the Redux store.
State Management: Redux is used to manage the application state.
4. Error Handling and Feedback
Graceful Error Handling: The application handles errors during the bulk edit process gracefully.
User Feedback: Provides appropriate feedback to users in case of errors or successful edits.

Usage:

**Access Bulk Edit Interface:**

Navigate to the invoice list screen.
Select multiple invoices using checkboxes.
Look for the "Bulk Edit" button.
Click the button to access the bulk edit interface.

**Perform Bulk Edits:**

Selected multiple invoices using checkboxes are displayed in new screen.
Edit invoice details in the Excel-like table.

**Save Changes:**

Click the "Save Changes" button to apply bulk edits.
