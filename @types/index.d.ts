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

// Sessions

export declare interface Session {
    config: DriverConfig,
    driver: Driver

    sleep(ms: Number, callback?: ResultCb): Promise<void>;
    stringify(obj: Object, pretty: boolean): string;
    parse(text: string): Object;
    refresh(callback?: (err: Error) => void): Promise<void>;
    disconnect(callback?: (err: Error) => void): Promise<void>;
    reauthenticate(reauthenticateFn: Function): void;
}

export declare interface ApplicationSession extends Session {
    reportApplication(application: (TypedID | string)): Promise<PlatformObject>;
}

export declare interface RepositorySession extends Session {
    createRepository(obj?: Object): Promise<PlatformObject>;
    queryRepositories(query?: Object, pagination?: Object): Promise<Rows<PlatformObject>>
}

export declare interface BranchSession extends Session {
    queryBranches(repository: TypedID|string, query?: Object, pagination?: Object): Promise<Rows<RepositoryObject>>;
    readBranch(repository: TypedID|string, branch: TypedID|string): Promise<RepositoryObject>;
    createBranch(repository: TypedID|string, branch: TypedID|string, changesetId?: string, obj?: Object): Promise<RepositoryObject>;
    listBranches(repository: TypedID|string): Promise<Rows<RepositoryObject>>;
    deleteBranch(repository: TypedID|string, branch: TypedID|string): Promise<void>;
    updateBranch(repository: TypedID|string, branch: TypedID|string, obj: Object): Promise<RepositoryObject>;
}

export declare interface DomainSession extends Session {
    createDomain(obj?: Object): Promise<PlatformObject>;
    queryDomains(query?: Object, pagination?: Object): Promise<Rows<PlatformObject>>;
    readDomain(domainId: string): Promise<PlatformObject>;
}

export declare interface GraphQLSession extends Session {
    graphqlQuery(repository: TypedID|string, branch: TypedID|string, query: string, operationName?: string, variables?: Object): Promise<GraphQLResult>;
    graphqlSchema(repository: TypedID|string, branch: TypedID|string): Promise<string>;
}

export declare interface NodeSession extends Session {
    readNode(repository: TypedID|string, branch: TypedID|string, nodeId: string, path?: string): Promise<Node>;
    queryNodes(repository: TypedID|string, branch: TypedID|string, query: Object, pagination?: Object): Promise<Rows<Node>>;
    searchNodes(repository: TypedID|string, branch: TypedID|string, search: Object|string, pagination?: Object): Promise<Rows<Node>>;
    findNodes(repository: TypedID|string, branch: TypedID|string, config: Object, pagination?: Object): Promise<Rows<Node>>;
    createNode(repository: TypedID|string, branch: TypedID|string, obj?: Object, options?: Object): Promise<Node>;
    queryNodeRelatives(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationTypeQName: string, associationDirection: string, query?: Object, pagination?: Object): Promise<Rows<Node>>;
    queryNodeChildren(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, query: Object, pagination?: Object): Promise<Rows<Node>>;
    listNodeAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, associationDirection?: string, pagination?: Object): Promise<Rows<Association>>;
    listOutgoingAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Object): Promise<Rows<Association>>;
    listIncomingAssociations(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Object): Promise<Rows<Association>>;
    associate(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string): Promise<Association>;
    unassociate(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string): Promise<void>;
    associateChild(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string): Promise<Association>;
    unassociateChild(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string): Promise<void>;
    deleteNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string): Promise<void>;
    deleteNodes(repository: TypedID|string, branch: TypedID|string, nodes: string|Array<string>|Array<TypedID>): Promise<void>;
    updateNode(repository: TypedID|string, branch: TypedID|string, node: Node): Promise<Node>;
    patchNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, patchObject: Object): Promise<Node>;
    addNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string, config?: Object): Promise<void>;
    removeNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string): Promise<void>;
    refreshNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string): Promise<void>;
    nodeTree(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config?: Object): Promise<Object>;
    resolveNodePath(repository: TypedID|string, branch: TypedID|string, node: TypedID|string): Promise<{path: string}>;
    resolveNodePaths(repository: TypedID|string, branch: TypedID|string, node: TypedID|string): Promise<{[id: string]: string}>;
    traverseNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config: Object): Promise<TraversalResult>;
    uploadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string, file: File, mimeType: string, filename?: string): Promise<void>;
    downloadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string): Promise<NodeJS.ReadStream>;
    listAttachments(repository: TypedID|string, branch: TypedID|string, node: TypedID|string): Promise<Rows<Attachment>>;
    deleteAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId?: string): Promise<void>;
}

export declare interface PrincipalSession extends Session {
    readPrincipal(domain: TypedID|string, principalId: string): Promise<Object>;
}

export declare interface ProjectSession extends Session {
    readProject(project: TypedID|string): Promise<PlatformObject>;
}

export declare interface StackSession extends Session {
    readStack(stack: TypedID|string): Promise<PlatformObject>;
    listDataStores(stack: TypedID|string): Promise<Rows<TypedID>>;
    queryDataStores(stack: TypedID|string, query: Object, pagination?: Object): Promise<Rows<TypedID>>;
}

export declare interface WorkflowSession extends Session {
    readWorkflow(workflowId: string): Promise<TypedID>;
    queryWorkflows(query: Object, pagination?: Object): Promise<Rows<TypedID>>;
    queryWorkflowTasks(query: Object, pagination?: Object): Promise<Rows<TypedID>>;
}


export declare type DefaultSession = ApplicationSession & RepositorySession & BranchSession & DomainSession & GraphQLSession & NodeSession & PrincipalSession & ProjectSession & StackSession & WorkflowSession;




