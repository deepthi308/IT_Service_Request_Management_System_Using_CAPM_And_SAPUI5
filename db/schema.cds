namespace service.request;

using {
    cuid,
    managed
} from '@sap/cds/common';


entity Categories : cuid, managed {
    name        : String(100) not null;
    description : String(255);
    requests    : Association to many Requests
                      on requests.category = $self;
}

entity Requests : cuid, managed {
    requestId       : String(20) not null;
    title           : String(150) not null;
    description     : String(1000);
    requester       : String(100) not null;
    assignedTo      : String(100);
    priority        : String(20) default 'MEDIUM';
    status          : String(20) default 'NEW';
    createdDate     : Timestamp;
    dueDate         : Date;
    resolvedDate    : Timestamp;
    resolutionNotes : String(1000);
    category        : Association to one Categories not null;
    comments        : Composition of many RequestComments
                          on comments.request = $self;
}

entity RequestComments : cuid, managed {
    comment     : String(1000) not null;
    author      : String(100) not null;
    commentDate : Timestamp;
    request     : Association to one Requests not null;
}
