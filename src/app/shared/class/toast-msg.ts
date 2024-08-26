export const ToastMsg = {
    save: [
        {
            msg: 'Failed',
            status: 'error'
        },
        {
            msg: '{0} Saved Successfully',
            status: 'success'
        },
        {
            msg: '{0} Already Exists',
            status: 'warn'
        },
        {
            msg: 'Dependant Data',
            status: 'warn'
        },
        {
            msg: 'No Content',
            status: 'warn'
        },
        {
            msg: 'Unauthorized User',
            status: 'warn'
        }
    ],
    submit: [
        {
            msg: 'Failed',
            status: 'error'
        },
        {
            msg: '{0} Submitted Successfully',
            status: 'success'
        }
    ],
    delete: [
        {
            msg: 'Failed',
            status: 'error'
        },
        {
            msg: '{0} Deleted Successfully',
            status: 'success'
        },
        {
            msg: 'Data Already Exists',
            status: 'warn'
        }
    ],
    upload: [
        {
            msg: 'Upload Failed',
            status: 'error'
        },
        {
            msg: 'File Uploaded Successfully',
            status: 'success'
        }
    ]
};


export const ToastMessage = {
    // Status Toast
    '1000': { 'msg': 'Status Update Failed', status: 'error' },
    '1001': { 'msg': 'Status Updated Successfully', status: 'success' },
    '1002': { 'msg': 'Duplicate Record', status: 'warn' },

    // Decision Toast
    '1100': { 'msg': 'Decision Update Failed', status: 'error' },
    '1101': { 'msg': 'Decision Updated Successfully', status: 'success' },
    '1102': { 'msg': 'Duplicate Record', status: 'warn' },

    //8D steps
    '1200': { 'msg': 'Failed to save data.', status: 'error' },
    '1201': { 'msg': 'Data saved successfully.', status: 'success' },
    '1300': { 'msg': 'Failed to delete data.', status: 'error' },
    '1301': { 'msg': 'Deleted successfully.', status: 'success' },

    //Incident Form
    '1400': { 'msg': 'Failed to save data.', status: 'error' },
    '1401': { 'msg': 'Incident saved successfully.', status: 'success' },
    '1501': { 'msg': 'Incident submitted successfully.', status: 'success' },
    '1402': { 'msg': 'Failed to delete data.', status: 'error' },
    '1403': { 'msg': 'Deleted successfully.', status: 'success' },

    /// D6 CA Verifier
    '1600': { 'msg': 'Failed to save data.', status: 'error' },
    '1601': { 'msg': 'CA Verifier saved successfully.', status: 'success' },
    '1602': { 'msg': 'Data Already exists', status: 'error' },
    '1603': { 'msg': 'CA Verifier Deleted successfully.', status: 'success' },

    // Delete
    '1700': { 'msg': 'Failed to delete data.', status: 'error' },
    '1701': { 'msg': 'Deleted Successfully.', status: 'success' },
    '1702': { 'msg': 'Failed to Delete Data.', status: 'error' },

    // D5 approve / reject
    '2000': { 'msg': 'Failed to send approval request.', status: 'error' },
    '2001': { 'msg': 'Approval request sent successfully.', status: 'success' },
    '2004': { 'msg': 'Please add approvers on D1 to send request.', status: 'error' },
    '2020': { 'msg': 'Failed to approve D5.', status: 'error' },
    '2021': { 'msg': 'D5 approved successfully.', status: 'success' },
    '2030': { 'msg': 'Failed to reject D5.', status: 'error' },
    '2031': { 'msg': 'D5 rejected successfully.', status: 'success' },

    // D5 / D8 cancel approval request
    '2100': { 'msg': 'Failed to cancel approval process.', status: 'error' },
    '2101': { 'msg': 'Approval process cancelled successfully.', status: 'success' },

    // D5 approve / reject
    '2200': { 'msg': 'Failed to send approval request.', status: 'error' },
    '2201': { 'msg': 'Approval request sent successfully.', status: 'success' },
    '2204': { 'msg': 'Please add approvers on D1 to send request.', status: 'error' },
    '2220': { 'msg': 'Failed to approve D8.', status: 'error' },
    '2221': { 'msg': 'D8 approved successfully.', status: 'success' },
    '2230': { 'msg': 'Failed to reject D8.', status: 'error' },
    '2231': { 'msg': 'D8 rejected successfully.', status: 'success' },

}

