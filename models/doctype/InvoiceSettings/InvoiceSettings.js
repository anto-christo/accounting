module.exports = {
    name: "InvoiceSettings",
    label: "Invoice Settings",
    doctype: "DocType",
    isSingle: 1,
    isChild: 0,
    keywordFields: [],
    fields: [
        {
            fieldname: "numberSeries",
            label: "Number Series",
            fieldtype: "Link",
            target: "NumberSeries",
            required: 1,
            default: "INV"
        },
        {
            fieldname: "template",
            label: "Template",
            fieldtype: "Select",
            options: ["Basic I", "Basic II", "Modern"],
            required: 1,
            default: "Basic I" 
        },
        {
            fieldname: "themeColor",
            label: "Theme Color",
            fieldtype: "Data",
            required: 1,
            default: "#007bff",
            hidden: 1
        }
    ]
}