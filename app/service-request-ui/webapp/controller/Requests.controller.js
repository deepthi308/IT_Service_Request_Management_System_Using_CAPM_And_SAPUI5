sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/mandeep/servicerequestui/model/formatter"
], function (
    Controller,
    MessageToast,
    Filter,
    FilterOperator,
    formatter
) {
    "use strict";

    return Controller.extend(
        "com.mandeep.servicerequestui.controller.Requests",
        {

            formatter: formatter,


            onInit: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("requests")
                    .attachPatternMatched(
                        this._onRouteMatched,
                        this
                    );

            },


            _onRouteMatched: function () {
                const oTable =
                    this.byId("requestsTable");
                if (!oTable) {
                    return;
                }
                const oBinding =
                    oTable.getBinding("items");
                if (!oBinding) {
                    return;
                }
                this._applyRequestFilter();
                oBinding.refresh();
            },


            _applyRequestFilter: function () {

                const oTable =
                    this.byId("requestsTable");

                if (!oTable) {
                    return;
                }

                const oBinding =
                    oTable.getBinding("items");

                if (!oBinding) {
                    return;
                }


                const oFilterModel =
                    this.getOwnerComponent()
                        .getModel("requestFilter");


                // No filter model means show all requests
                if (!oFilterModel) {

                    oBinding.filter([]);

                    return;
                }


                const sStatus =
                    oFilterModel.getProperty(
                        "/status"
                    );


                // No status means show all requests
                if (!sStatus) {

                    oBinding.filter([]);

                    return;
                }


                const oStatusFilter =
                    new Filter(
                        "status",
                        FilterOperator.EQ,
                        sStatus
                    );


                oBinding.filter([
                    oStatusFilter
                ]);

            },


            onRequestPress: function (oEvent) {

                const oSource =
                    oEvent.getSource();

                const oContext =
                    oSource.getBindingContext();

                if (!oContext) {

                    return;

                }


                const sId =
                    oContext.getProperty("ID");


                this.getOwnerComponent()
                    .getRouter()
                    .navTo(
                        "requestDetails",
                        {
                            requestId: sId
                        }
                    );

            },


            onCreateRequest: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo(
                        "createRequest"
                    );

            },


            onRefresh: function () {

                const oTable =
                    this.byId("requestsTable");

                const oBinding =
                    oTable.getBinding("items");


                if (oBinding) {

                    oBinding.refresh();

                    MessageToast.show(
                        "Requests refreshed"
                    );

                }

            },


            onBack: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo(
                        "dashboard"
                    );

            }

        }
    );
});