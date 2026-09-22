sap.ui.define(
    [],
    function () {
        "use strict";
        return {

            emptyValue: function (sValue) {
                if (
                    sValue === null ||
                    sValue === undefined ||
                    String(sValue).trim() === ""
                ) {
                    return "--";
                }

                return sValue;
            },

            statusState: function (sStatus) {
                switch (sStatus) {
                    case "New":
                        return "Information";
                    case "In Progress":
                        return "Warning";
                    case "Resolved":
                        return "Success";
                    case "Closed":
                        return "None";
                    default:
                        return "None";
                }
            },

            priorityState: function (sPriority) {

                switch (sPriority) {

                    case "LOW":
                        return "Success";

                    case "MEDIUM":
                        return "Warning";

                    case "HIGH":
                        return "Error";

                    case "CRITICAL":
                        return "Error";

                    default:
                        return "None";
                }
            },
        }
    }
)