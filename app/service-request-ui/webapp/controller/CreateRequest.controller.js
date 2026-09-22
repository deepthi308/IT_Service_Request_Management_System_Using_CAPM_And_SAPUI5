sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (
    Controller,
    JSONModel,
    MessageToast,
    MessageBox
) {
    "use strict";

    return Controller.extend(
        "com.mandeep.servicerequestui.controller.CreateRequest",
        {

            onInit: function () {

                const oViewModel = new JSONModel({
                    title: "",
                    description: "",
                    requester: "",
                    categoryId: "",
                    priority: "MEDIUM",
                    dueDate: ""
                });

                this.getView().setModel(
                    oViewModel,
                    "view"
                );

                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("createRequest")
                    .attachPatternMatched(
                        this._onRouteMatched,
                        this
                    );
            },


            _onRouteMatched: function () {

                this._resetForm();

            },


            _resetForm: function () {

                const oViewModel =
                    this.getView().getModel("view");

                oViewModel.setData({
                    title: "",
                    description: "",
                    requester: "",
                    categoryId: "",
                    priority: "MEDIUM",
                    dueDate: ""
                });

            },


            onCreateRequest: async function () {

                const oViewModel =
                    this.getView().getModel("view");

                const oData =
                    oViewModel.getData();

                const sTitle =
                    oData.title?.trim();

                const sDescription =
                    oData.description?.trim();

                const sRequester =
                    oData.requester?.trim();

                const sCategoryId =
                    oData.categoryId;

                const sPriority =
                    oData.priority || "MEDIUM";

                const sDueDate =
                    oData.dueDate;


                // Validation
                if (!sTitle) {

                    MessageBox.warning(
                        "Please enter the request title."
                    );

                    return;
                }


                if (!sDescription) {

                    MessageBox.warning(
                        "Please enter a description."
                    );

                    return;
                }


                if (!sRequester) {

                    MessageBox.warning(
                        "Please enter the requester name."
                    );

                    return;
                }


                if (!sCategoryId) {

                    MessageBox.warning(
                        "Please select a category."
                    );

                    return;
                }


                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();


                    // Bind to CAP action
                    const oAction =
                        oModel.bindContext(
                            "/createRequest(...)"
                        );


                    // Set action parameters
                    oAction.setParameter(
                        "title",
                        sTitle
                    );

                    oAction.setParameter(
                        "description",
                        sDescription
                    );

                    oAction.setParameter(
                        "requester",
                        sRequester
                    );

                    oAction.setParameter(
                        "categoryId",
                        sCategoryId
                    );

                    oAction.setParameter(
                        "priority",
                        sPriority
                    );


                    if (sDueDate) {

                        oAction.setParameter(
                            "dueDate",
                            sDueDate
                        );

                    }


                    // Execute action
                    await oAction.execute();


                    MessageToast.show(
                        "Service request created successfully."
                    );


                    // Navigate to request list
                    this.getOwnerComponent()
                        .getRouter()
                        .navTo("requests");

                } catch (oError) {

                    console.error(
                        "Create request error:",
                        oError
                    );

                    MessageBox.error(
                        oError.message ||
                        "Unable to create the service request."
                    );

                }

            },


            onCancel: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("requests");

            }

        }
    );
});