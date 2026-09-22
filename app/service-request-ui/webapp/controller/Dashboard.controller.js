sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (
    Controller,
    JSONModel,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "com.mandeep.servicerequestui.controller.Dashboard",
        {

            onInit: function () {

                const oDashboardModel = new JSONModel({
                    total: 0,
                    new: 0,
                    inProgress: 0,
                    resolved: 0,
                    closed: 0
                });

                this.getView().setModel(
                    oDashboardModel,
                    "dashboard"
                );

                // Load dashboard data initially
                this._loadDashboardData();

                // Reload dashboard data whenever we navigate back
                // to the Dashboard route
                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("dashboard")
                    .attachPatternMatched(
                        this._onDashboardRouteMatched,
                        this
                    );
            },

            _onDashboardRouteMatched: function () {

                this._loadDashboardData();

            },

            _loadDashboardData: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const oBinding =
                        oModel.bindList("/Requests");

                    const aContexts =
                        await oBinding.requestContexts(
                            0,
                            1000
                        );

                    const aRequests =
                        aContexts.map(
                            function (oContext) {
                                return oContext.getObject();
                            }
                        );

                    const oDashboardModel =
                        this.getView()
                            .getModel("dashboard");

                    oDashboardModel.setData({

                        total:
                            aRequests.length,

                        new:
                            aRequests.filter(
                                function (oRequest) {
                                    return oRequest.status === "NEW";
                                }
                            ).length,

                        inProgress:
                            aRequests.filter(
                                function (oRequest) {
                                    return oRequest.status === "IN_PROGRESS";
                                }
                            ).length,

                        resolved:
                            aRequests.filter(
                                function (oRequest) {
                                    return oRequest.status === "RESOLVED";
                                }
                            ).length,

                        closed:
                            aRequests.filter(
                                function (oRequest) {
                                    return oRequest.status === "CLOSED";
                                }
                            ).length

                    });

                } catch (oError) {

                    MessageToast.show(
                        "Unable to load dashboard data."
                    );

                    console.error(
                        "Dashboard loading error:",
                        oError
                    );
                }
            },


            _navigateToRequests: function (sStatus) {

                let oFilterModel =
                    this.getOwnerComponent()
                        .getModel("requestFilter");


                if (!oFilterModel) {

                    oFilterModel =
                        new JSONModel({
                            status: null
                        });

                    this.getOwnerComponent()
                        .setModel(
                            oFilterModel,
                            "requestFilter"
                        );
                }


                oFilterModel.setProperty(
                    "/status",
                    sStatus
                );


                this.getOwnerComponent()
                    .getRouter()
                    .navTo("requests");

            },


            onViewRequests: function () {

                this._navigateToRequests(
                    null
                );

            },


            onViewNewRequests: function () {

                this._navigateToRequests(
                    "NEW"
                );

            },


            onViewInProgressRequests: function () {

                this._navigateToRequests(
                    "IN_PROGRESS"
                );

            },


            onViewResolvedRequests: function () {

                this._navigateToRequests(
                    "RESOLVED"
                );

            },


            onViewClosedRequests: function () {

                this._navigateToRequests(
                    "CLOSED"
                );

            },


            onCreateRequest: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("createRequest");

            }

        }
    );
});