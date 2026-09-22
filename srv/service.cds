using service.request as db from '../db/schema';

service ServiceRequestService @(path: '/service-requests') {

    @readonly
    entity Categories as projection on db.Categories;

    entity Requests as projection on db.Requests;

    entity RequestComments as projection on db.RequestComments;

    action createRequest(
        title       : String(150),
        description : String(1000),
        requester   : String(100),
        categoryId  : UUID,
        priority    : String(20),
        dueDate     : Date
    ) returns Requests;

    action assignRequest(
        requestId   : UUID,
        assignedTo  : String(100)
    ) returns Requests;

    action startRequest(
        requestId : UUID
    ) returns Requests;

    action resolveRequest(
        requestId       : UUID,
        resolutionNotes : String(1000)
    ) returns Requests;

    action closeRequest(
        requestId : UUID
    ) returns Requests;
}
