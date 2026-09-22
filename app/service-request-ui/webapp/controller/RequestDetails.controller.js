sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/TextArea",
    "sap/m/Button",
    "com/mandeep/servicerequestui/model/formatter"
], function (
    Controller,
    MessageToast,
    MessageBox,
    Dialog,
    TextArea,
    Button,
    formatter
) {
    "use strict";

    return Controller.extend(
        "com.mandeep.servicerequestui.controller.RequestDetails",
        {

            formatter: formatter,


            onInit: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("requestDetails")
                    .attachPatternMatched(
                        this._onRouteMatched,
                        this
                    );

            },


            _onRouteMatched: function (oEvent) {

                const sRequestId =
                    oEvent
                        .getParameter("arguments")
                        .requestId;

                const oView =
                    this.getView();

                oView.bindElement({
                    path: `/Requests(${sRequestId})`
                });

            },


            onBack: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("requests");

            },


            onAssignRequest: async function () {

                const oView =
                    this.getView();

                const oContext =
                    oView.getBindingContext();

                if (!oContext) {
                    return;
                }

                const sRequestId =
                    oContext.getProperty("ID");


                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const oAction =
                        oModel.bindContext(
                            "/assignRequest(...)"
                        );


                    oAction.setParameter(
                        "requestId",
                        sRequestId
                    );

                    oAction.setParameter(
                        "assignedTo",
                        "IT Support"
                    );


                    await oAction.execute();


                    MessageToast.show(
                        "Request assigned successfully."
                    );


                    oContext.refresh();

                } catch (oError) {

                    console.error(
                        "Assign request error:",
                        oError
                    );

                    MessageBox.error(
                        oError.message ||
                        "Unable to assign the request."
                    );

                }

            },


            onStartRequest: async function () {

                const oView =
                    this.getView();

                const oContext =
                    oView.getBindingContext();

                if (!oContext) {
                    return;
                }

                const sRequestId =
                    oContext.getProperty("ID");


                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const oAction =
                        oModel.bindContext(
                            "/startRequest(...)"
                        );


                    oAction.setParameter(
                        "requestId",
                        sRequestId
                    );


                    await oAction.execute();


                    MessageToast.show(
                        "Request started successfully."
                    );


                    oContext.refresh();

                } catch (oError) {

                    console.error(
                        "Start request error:",
                        oError
                    );

                    MessageBox.error(
                        oError.message ||
                        "Unable to start the request."
                    );

                }

            },


            onResolveRequest: function () {

                const oView = this.getView();
                const oContext = oView.getBindingContext();

                if (!oContext) {
                    return;
                }

                const sRequestId =
                    oContext.getProperty("ID");

                const oTextArea = new TextArea({
                    width: "100%",
                    rows: 5,
                    placeholder: "Enter resolution notes..."
                });

                const oDialog = new Dialog({
                    title: "Resolve Request",
                    contentWidth: "450px",
                    content: [
                        oTextArea
                    ],

                    beginButton: new Button({
                        text: "Resolve",
                        type: "Emphasized",

                        press: async function () {

                            const sResolutionNotes =
                                oTextArea.getValue().trim();

                            if (!sResolutionNotes) {

                                MessageBox.warning(
                                    "Please enter resolution notes."
                                );

                                return;
                            }

                            try {

                                const oModel =
                                    this.getOwnerComponent()
                                        .getModel();

                                const oAction =
                                    oModel.bindContext(
                                        "/resolveRequest(...)"
                                    );

                                oAction.setParameter(
                                    "requestId",
                                    sRequestId
                                );

                                oAction.setParameter(
                                    "resolutionNotes",
                                    sResolutionNotes
                                );

                                await oAction.execute();

                                MessageToast.show(
                                    "Request resolved successfully."
                                );

                                oDialog.close();

                                oContext.refresh();

                            } catch (oError) {

                                console.error(
                                    "Resolve request error:",
                                    oError
                                );

                                MessageBox.error(
                                    oError.message ||
                                    "Unable to resolve the request."
                                );
                            }
                        }.bind(this)
                    }),

                    endButton: new Button({
                        text: "Cancel",

                        press: function () {

                            oDialog.close();

                        }
                    }),

                    afterClose: function () {

                        oDialog.destroy();

                    }
                });

                oView.addDependent(oDialog);

                oDialog.open();
            },


            onCloseRequest: async function () {

                const oView =
                    this.getView();

                const oContext =
                    oView.getBindingContext();

                if (!oContext) {
                    return;
                }

                const sRequestId =
                    oContext.getProperty("ID");


                MessageBox.confirm(
                    "Are you sure you want to close this request?",
                    {
                        title: "Close Request",
                        actions: [
                            MessageBox.Action.OK,
                            MessageBox.Action.CANCEL
                        ],
                        emphasizedAction:
                            MessageBox.Action.OK,

                        onClose: async function (
                            sAction
                        ) {

                            if (
                                sAction !==
                                MessageBox.Action.OK
                            ) {
                                return;
                            }


                            try {

                                const oModel =
                                    this.getOwnerComponent()
                                        .getModel();

                                const oAction =
                                    oModel.bindContext(
                                        "/closeRequest(...)"
                                    );


                                oAction.setParameter(
                                    "requestId",
                                    sRequestId
                                );


                                await oAction.execute();


                                MessageToast.show(
                                    "Request closed successfully."
                                );


                                oContext.refresh();

                            } catch (oError) {

                                console.error(
                                    "Close request error:",
                                    oError
                                );

                                MessageBox.error(
                                    oError.message ||
                                    "Unable to close the request."
                                );

                            }

                        }.bind(this)
                    }
                );

            }

        }
    );
});