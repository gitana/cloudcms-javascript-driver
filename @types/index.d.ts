/// <reference lib="ES2015" />
/// <reference lib="DOM" />
/// <reference types="node" />

// Driver 

export declare function session(sessionClass: ObjectConstructor): void;
export declare function driver(driverClass: ObjectConstructor): void;
export declare function storage(storageClass: ObjectConstructor): void;
export declare function connect(connectConfig?: DriverConfig, callback?: ResultCb<DefaultSession>): Promise<DefaultSession>;
export declare function connect(callback?: ResultCb<DefaultSession>): Promise<DefaultSession>;
export declare function connect<T extends Session>(connectConfig: DriverConfig, callback?: ResultCb<T>): Promise<T>;
export declare function connect<T extends Session>(callback?: ResultCb<T>): Promise<T>;


export declare interface params {
    [key: string]: string
}

export declare type ResultCb<T=Object> = (err: Error, result: T) => void;

export declare interface DriverConfig {
    clientKey: string,
    clientSecret: string,
    username: string,
    password: string,
    baseURL?: string,
    application?: string
}

export declare interface Driver {
    get(url: string, qs?: params, callback?: ResultCb): Promise<Object>;
    post(url: string, qs?: params, payload?: Object, callback?: ResultCb): Promise<Object>;
    put(url: string, qs?: params, payload?: Object, callback?: ResultCb): Promise<Object>;
    del(url: string, qs?: params, callback?: ResultCb): Promise<Object>;
    multipartPost(url: string, qs?: params, formData?: Object, callback?: ResultCb): Promise<Object>;
    download(url: string, qs?: params, callback?: ResultCb): Promise<Object>;
    
    reauthenticate(reauthenticateFn: Function): void;
    disconnect(callback: (err: string) => void): void;
}

// Data objects

export declare interface Rows<T> {
    size: Number,
    total_rows: Number,
    offset: Number,
    rows: Array<T>
}

export declare interface TypedID {
    _doc: string,
    [key: string]: any
}

export declare interface PlatformObject extends TypedID {
    platformId: string
}

export declare interface RepositoryObject extends PlatformObject {
    repositoryId: string
}

export declare interface Node extends TypedID {
    _qname: string,
    _type: string
}

export declare interface Association extends Node {
    source: string,
    source_type: string,
    target: string, 
    target_type: string,
    directionality: "DIRECTED" | "UNDIRECTED"
}

export default interface Changeset extends RepositoryObject {
    revision: string,
    branch: string,
    active: boolean,
    parents: string[],
    summary?: string,
    tags?: string[],
}

export declare interface GraphQLResult {
    data?: Object,
    errors?: Array<Object>
}

export declare interface Attachment {
    length: number,
    contentType: string,
    filename: string,
    objectId: string
}

export declare interface TraversalResult {
    node: string,
    config: Object,
    node_count: Number,
    nodes: {[id: string]: Node}
    associations: {[id: string]: Association}
}

export declare interface TreeConfig {
    leafPath?: string,
    basePath?: string,
    containers?: boolean,
    depth?: Number,
    properties?: boolean,
    query?: Object,
    search?: Object
}

export declare interface TreeElement {
    id: string,
    repositoryId: string,
    branchId: string,
    rootNodeId: string,

    // container
    container?: boolean,
    children?: Array<TreeElement>,
    childCount?: Number,
    childContainerCount?: Number

    // file info
    filename: string,
    label: string,
    path: string,

    description?: string,
    typeQName?: string,
    qname?: string,
    properties?: Object,
    _object?: Object
}


export declare interface NodeVersionOptions {
    excludeSystem?: boolean,
    diff?: boolean
}

export declare interface StartJobResult {
    _doc: string;
}

export declare type JobState = "NONE" | "WAITING" | "RUNNING" | "FINISHED" | "ERROR" | "PAUSED" | "AWAITING"

export declare interface Job extends TypedID {
    state: JobState,
    type: string
}

export declare interface Principal extends TypedID {
    name: string,
    type: string
}

export declare interface DataStore extends PlatformObject {

}


// Sessions

export declare interface Session {
    config: DriverConfig,
    driver: Driver

    sleep(ms: Number, callback?: ResultCb<void>): Promise<void>;
    stringify(obj: Object, pretty: boolean): string;
    parse(text: string): Object;
    refresh(callback?: (err: Error) => void): Promise<void>;
    disconnect(callback?: (err: Error) => void): Promise<void>;
    reauthenticate(reauthenticateFn: Function): void;
}

export declare interface ApplicationSession extends Session {
    readApplication(application: (TypedID | string), callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
}

export declare interface RepositorySession extends Session {
    createRepository(obj?: Object, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
    queryRepositories(query?: Object, pagination?: Object, callback?: ResultCb<Rows<PlatformObject>>): Promise<Rows<PlatformObject>>
}

export declare interface BranchSession extends Session {
    queryBranches(repository: TypedID|string, query?: Object, pagination?: Object, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<RepositoryObject>>;
    readBranch(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<RepositoryObject>): Promise<RepositoryObject>;
    createBranch(repository: TypedID|string, branch: TypedID|string, changesetId?: string, obj?: Object, callback?: ResultCb<RepositoryObject>): Promise<RepositoryObject>;
    listBranches(repository: TypedID|string, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<RepositoryObject>>;
    deleteBranch(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<void>): Promise<void>;
    updateBranch(repository: TypedID|string, branch: TypedID|string, obj: Object, callback?: ResultCb<RepositoryObject>): Promise<RepositoryObject>;
    resetBranch(repository: TypedID|string, branch: TypedID|string, changeset: string|TypedID, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>;
}

export declare interface DomainSession extends Session {
    createDomain(obj?: Object, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
    queryDomains(query?: Object, pagination?: Object, callback?: ResultCb<Rows<PlatformObject>>): Promise<Rows<PlatformObject>>;
    readDomain(domainId: string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
}

export declare interface GraphQLSession extends Session {
    graphqlQuery(repository: TypedID|string, branch: TypedID|string, query: string, operationName?: string, variables?: Object, callback?: ResultCb<GraphQLResult>): Promise<GraphQLResult>;
    graphqlSchema(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<string>): Promise<string>;
}

export declare interface NodeSession extends Session {
    readNode(repository: TypedID|string, branch: TypedID|string, nodeId: string, path?: string, callback?: ResultCb<Node>): Promise<Node>;
    queryNodes(repository: TypedID|string, branch: TypedID|string, query: Object, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    searchNodes(repository: TypedID|string, branch: TypedID|string, search: Object|string, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    findNodes(repository: TypedID|string, branch: TypedID|string, config: Object, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    createNode(repository: TypedID|string, branch: TypedID|string, obj?: Object, options?: Object, callback?: ResultCb<Node>): Promise<Node>;
    queryNodeRelatives(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationTypeQName: string, associationDirection: string, query?: Object, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    queryNodeChildren(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, query: Object, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    listNodeAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, associationDirection?: string, pagination?: Object, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>;
    listOutgoingAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Object, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>;
    listIncomingAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Object, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>;
    associate(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<Association>): Promise<Association>;
    unassociate(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<void>): Promise<void>;
    associateChild(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string, callback?: ResultCb<Association>): Promise<Association>;
    unassociateChild(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string, callback?: ResultCb<void>): Promise<void>;
    deleteNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<void>): Promise<void>;
    deleteNodes(repository: TypedID|string, branch: TypedID|string, nodes: string|Array<string>|Array<TypedID>, callback?: ResultCb<void>): Promise<void>;
    updateNode(repository: TypedID|string, branch: TypedID|string, node: Node, callback?: ResultCb<Node>): Promise<Node>;
    patchNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, patchObject: Object, callback?: ResultCb<Node>): Promise<Node>;
    addNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string, config?: Object, callback?: ResultCb<void>): Promise<void>;
    removeNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string, callback?: ResultCb<void>): Promise<void>;
    refreshNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<void>): Promise<void>;
    changeNodeQName(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, newQName: string, callback?: ResultCb<Object>): Promise<Object>;
    nodeTree(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config?: TreeConfig, callback?: ResultCb<TreeElement>): Promise<TreeElement>;
    resolveNodePath(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<{path: string}>): Promise<{path: string}>;
    resolveNodePaths(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<{[id: string]: string}>): Promise<{[id: string]: string}>;
    traverseNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config: Object, callback?: ResultCb<TraversalResult>): Promise<TraversalResult>;
    uploadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string, file: File, mimeType: string, filename?: string, callback?: ResultCb<void>): Promise<void>;
    downloadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>;
    listAttachments(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<Rows<Attachment>>): Promise<Rows<Attachment>>;
    deleteAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId?: string, callback?: ResultCb<void>): Promise<void>;
    listVersions(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, options?: NodeVersionOptions, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
    readVersion(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, changesetId: string, options?: NodeVersionOptions, callback?: ResultCb<Node>): Promise<Node>;
    restoreVersion(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, changesetId: string, callback?: ResultCb<Node>): Promise<Node>;
}

export declare interface PrincipalSession extends Session {
    readPrincipal(domain: TypedID|string, principalId: string, callback?: ResultCb<Principal>): Promise<Principal>;
    queryPrincipals(domain: TypedID|string, query: Object, pagination?: Object, callback?: ResultCb<Rows<Principal>>): Promise<Rows<Principal>>;
}

export declare interface ProjectSession extends Session {
    readProject(project: TypedID|string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
}

export declare interface StackSession extends Session {
    readStack(stack: TypedID|string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>;
    readDataStore(stack: TypedID|string, key: string, callback?: ResultCb<DataStore>): Promise<DataStore>
    listDataStores(stack: TypedID|string, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>;
    queryDataStores(stack: TypedID|string, query: Object, pagination?: Object, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>;
    findDataStoreStack(dataStore: string|DataStore, dataStoreType: string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>
    assignDataStore(stack: TypedID|string, dataStore: string|DataStore, key: string, callback?: ResultCb<void>): Promise<void>
    unassignDataStore(stack: TypedID|string, key: string, callback?: ResultCb<void>): Promise<void>
}

export declare interface WorkflowSession extends Session {
    readWorkflow(workflowId: string, callback?: ResultCb<TypedID>): Promise<TypedID>;
    queryWorkflows(query: Object, pagination?: Object, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>;
    queryWorkflowTasks(query: Object, pagination?: Object, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>;
}

export declare interface ChangesetSession extends Session {
    readChangeset(repository: string|TypedID, changeset: string|TypedID, callback?: ResultCb<Changeset>): Promise<Changeset>;
    queryChangesets(repository: string|TypedID, query: Object, pagination?: Object, callback?: ResultCb<Rows<Changeset>>): Promise<Rows<Changeset>>;
    listChangesets(repository: string|TypedID, pagination?: Object, callback?: ResultCb<Rows<Changeset>>): Promise<Rows<Changeset>>;
    listChangesetNodes(repository: string|TypedID, changeset: string|TypedID, pagination?: Object, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>;
}

export declare interface JobSession extends Session {
    readJob(jobId: string|TypedID, callback?: ResultCb<Job>): Promise<Job>;
    queryJobs(query: Object, pagination?: Object, callback?: ResultCb<Rows<Job>>): Promise<Rows<Job>>
    killJob(jobId: string|TypedID, callback?: ResultCb<Job>): Promise<Job>
}

export declare interface TransferSession extends Session {
    exportArchive(sourceRefs: Array<string>, group: string, artifact: string, version: string, configuration: Object, vault: string|PlatformObject, callback: ResultCb<StartJobResult>): Promise<StartJobResult>;
    importArchive(targetRef: string, group: string, artifact: string, version: string, configuration: Object, vault: string|TypedID, callback: ResultCb<StartJobResult>): Promise<StartJobResult>;
}


export declare type DefaultSession = ApplicationSession & RepositorySession & BranchSession & DomainSession & GraphQLSession & NodeSession & PrincipalSession & ProjectSession & StackSession & WorkflowSession & ChangesetSession & JobSession & TransferSession;




