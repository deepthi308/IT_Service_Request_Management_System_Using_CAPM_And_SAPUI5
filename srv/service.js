import cds from '@sap/cds';

class ServiceRequestService extends cds.ApplicationService {

    async init() {

        /*
         * Connect to the primary database.
         * All SELECT, INSERT and UPDATE operations
         * below use this connection explicitly.
         */
        const db = await cds.connect.to("db");


        const {
            Categories,
            Requests,
            RequestComments
        } = this.entities;


        /*
         * ============================================================
         * REQUEST VALIDATION
         * ============================================================
         */

        this.before(
            'CREATE',
            Requests,
            async (req) => {

                const {
                    requestId,
                    title,
                    requester,
                    priority
                } = req.data;


                if (!requestId) {

                    req.error(
                        400,
                        'Request ID is required.',
                        'requestId'
                    );

                }


                if (!title) {

                    req.error(
                        400,
                        'Request title is required.',
                        'title'
                    );

                }


                if (!requester) {

                    req.error(
                        400,
                        'Requester is required.',
                        'requester'
                    );

                }


                const allowedPriorities = [
                    'LOW',
                    'MEDIUM',
                    'HIGH',
                    'CRITICAL'
                ];


                if (
                    priority &&
                    !allowedPriorities.includes(priority)
                ) {

                    req.error(
                        400,
                        'Priority must be LOW, MEDIUM, HIGH or CRITICAL.',
                        'priority'
                    );

                }

            }
        );


        /*
         * ============================================================
         * CREATE REQUEST
         * ============================================================
         */

        this.on(
            'createRequest',
            async (req) => {

                const {
                    title,
                    description,
                    requester,
                    categoryId,
                    priority,
                    dueDate
                } = req.data;


                if (!title) {

                    return req.error(
                        400,
                        'Request title is required.'
                    );

                }


                if (!requester) {

                    return req.error(
                        400,
                        'Requester is required.'
                    );

                }


                if (!categoryId) {

                    return req.error(
                        400,
                        'Category is required.'
                    );

                }


                /*
                 * Check whether the selected category exists.
                 */
                const category =
                    await db.run(
                        SELECT.one
                            .from(Categories)
                            .where({
                                ID: categoryId
                            })
                    );


                if (!category) {

                    return req.error(
                        404,
                        'Selected category was not found.'
                    );

                }


                /*
                 * Find the latest request number.
                 */
                const lastRequest =
                    await db.run(
                        SELECT.one
                            .from(Requests)
                            .columns('requestId')
                            .orderBy({
                                requestId: 'desc'
                            })
                    );


                let nextNumber = 1;


                if (lastRequest?.requestId) {

                    const numberPart =
                        parseInt(
                            lastRequest
                                .requestId
                                .replace('SR', '')
                        );


                    if (!isNaN(numberPart)) {

                        nextNumber =
                            numberPart + 1;

                    }

                }


                const requestId =
                    `SR${String(nextNumber).padStart(3, '0')}`;


                /*
                 * Create the request.
                 */
                await db.run(
                    INSERT
                        .into(Requests)
                        .entries({

                            requestId,

                            title,

                            description,

                            requester,

                            category_ID:
                                categoryId,

                            priority:
                                priority || 'MEDIUM',

                            status:
                                'NEW',

                            dueDate

                        })
                );


                /*
                 * Return the newly created request.
                 */
                return db.run(
                    SELECT.one
                        .from(Requests)
                        .where({
                            requestId
                        })
                );

            }
        );


        /*
         * ============================================================
         * ASSIGN REQUEST
         *
         * NEW → ASSIGNED
         * ============================================================
         */

        this.on(
            'assignRequest',
            async (req) => {

                const {
                    requestId,
                    assignedTo
                } = req.data;


                if (!requestId) {

                    return req.error(
                        400,
                        'Request ID is required.'
                    );

                }


                if (!assignedTo) {

                    return req.error(
                        400,
                        'Assigned user is required.'
                    );

                }


                /*
                 * Find the request using the UUID.
                 */
                const request =
                    await db.run(
                        SELECT.one
                            .from(Requests)
                            .where({
                                ID: requestId
                            })
                    );


                if (!request) {

                    return req.error(
                        404,
                        'Request not found.'
                    );

                }


                /*
                 * Only NEW requests can be assigned.
                 */
                if (request.status !== 'NEW') {

                    return req.error(
                        400,
                        'Only NEW requests can be assigned.'
                    );

                }


                /*
                 * Assign the request and change status.
                 */
                await db.run(
                    UPDATE(Requests)
                        .set({

                            assignedTo,

                            status:
                                'ASSIGNED'

                        })
                        .where({
                            ID: requestId
                        })
                );


                /*
                 * Return the updated request.
                 */
                return db.run(
                    SELECT.one
                        .from(Requests)
                        .where({
                            ID: requestId
                        })
                );

            }
        );


        /*
         * ============================================================
         * START REQUEST
         *
         * ASSIGNED → IN_PROGRESS
         * ============================================================
         */

        this.on(
            'startRequest',
            async (req) => {

                const {
                    requestId
                } = req.data;


                if (!requestId) {

                    return req.error(
                        400,
                        'Request ID is required.'
                    );

                }


                const request =
                    await db.run(
                        SELECT.one
                            .from(Requests)
                            .where({
                                ID: requestId
                            })
                    );


                if (!request) {

                    return req.error(
                        404,
                        'Request not found.'
                    );

                }


                /*
                 * Only ASSIGNED requests can be started.
                 */
                if (request.status !== 'ASSIGNED') {

                    return req.error(
                        400,
                        'Only ASSIGNED requests can be started.'
                    );

                }


                await db.run(
                    UPDATE(Requests)
                        .set({
                            status:
                                'IN_PROGRESS'
                        })
                        .where({
                            ID: requestId
                        })
                );


                return db.run(
                    SELECT.one
                        .from(Requests)
                        .where({
                            ID: requestId
                        })
                );

            }
        );


        /*
         * ============================================================
         * RESOLVE REQUEST
         *
         * IN_PROGRESS → RESOLVED
         * ============================================================
         */

        this.on(
            'resolveRequest',
            async (req) => {

                const {
                    requestId,
                    resolutionNotes
                } = req.data;


                if (!requestId) {

                    return req.error(
                        400,
                        'Request ID is required.'
                    );

                }


                const request =
                    await db.run(
                        SELECT.one
                            .from(Requests)
                            .where({
                                ID: requestId
                            })
                    );


                if (!request) {

                    return req.error(
                        404,
                        'Request not found.'
                    );

                }


                /*
                 * Only IN_PROGRESS requests can be resolved.
                 */
                if (request.status !== 'IN_PROGRESS') {

                    return req.error(
                        400,
                        'Only IN_PROGRESS requests can be resolved.'
                    );

                }


                if (!resolutionNotes) {

                    return req.error(
                        400,
                        'Resolution notes are required.'
                    );

                }


                await db.run(
                    UPDATE(Requests)
                        .set({

                            status:
                                'RESOLVED',

                            resolutionNotes,

                            resolvedDate:
                                new Date()

                        })
                        .where({
                            ID: requestId
                        })
                );


                return db.run(
                    SELECT.one
                        .from(Requests)
                        .where({
                            ID: requestId
                        })
                );

            }
        );


        /*
         * ============================================================
         * CLOSE REQUEST
         *
         * RESOLVED → CLOSED
         * ============================================================
         */

        this.on(
            'closeRequest',
            async (req) => {

                const {
                    requestId
                } = req.data;


                if (!requestId) {

                    return req.error(
                        400,
                        'Request ID is required.'
                    );

                }


                const request =
                    await db.run(
                        SELECT.one
                            .from(Requests)
                            .where({
                                ID: requestId
                            })
                    );


                if (!request) {

                    return req.error(
                        404,
                        'Request not found.'
                    );

                }


                /*
                 * Only RESOLVED requests can be closed.
                 */
                if (request.status !== 'RESOLVED') {

                    return req.error(
                        400,
                        'Only RESOLVED requests can be closed.'
                    );

                }


                await db.run(
                    UPDATE(Requests)
                        .set({
                            status:
                                'CLOSED'
                        })
                        .where({
                            ID: requestId
                        })
                );


                return db.run(
                    SELECT.one
                        .from(Requests)
                        .where({
                            ID: requestId
                        })
                );

            }
        );


        /*
         * ============================================================
         * REQUEST COMMENTS VALIDATION
         * ============================================================
         */

        this.before(
            'CREATE',
            RequestComments,
            async (req) => {

                if (!req.data.comment) {

                    req.error(
                        400,
                        'Comment is required.',
                        'comment'
                    );

                }


                if (!req.data.author) {

                    req.error(
                        400,
                        'Comment author is required.',
                        'author'
                    );

                }


                if (!req.data.request_ID) {

                    req.error(
                        400,
                        'Request reference is required.',
                        'request_ID'
                    );

                }

            }
        );


        return super.init();

    }
}


export default ServiceRequestService;