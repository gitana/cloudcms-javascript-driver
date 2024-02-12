/// <reference lib="ES2015" />
/// <reference lib="DOM" />
/// <reference types="node" />

// Driver 

export declare function session(sessionClass: ObjectConstructor): void
export declare function driver(driverClass: ObjectConstructor): void
export declare function storage(storageClass: ObjectConstructor): void
export declare function connect(connectConfig?: DriverConfig, callback?: ResultCb<DefaultSession>): Promise<DefaultSession>
export declare function connect(callback?: ResultCb<DefaultSession>): Promise<DefaultSession>
export declare function connect<T extends Session>(connectConfig: DriverConfig, callback?: ResultCb<T>): Promise<T>
export declare function connect<T extends Session>(callback?: ResultCb<T>): Promise<T>


export declare interface params {
    [key: string]: string
}

export declare type ResultCb<T=Object> = (err: Error, result: T) => void

export declare interface DriverConfig {
    clientKey?: string
    clientSecret?: string
    username?: string
    password?: string
    baseURL?: string
    application?: string,
    fetch?: Function
}

export declare interface Driver {
    get(url: string, qs?: params, callback?: ResultCb): Promise<Object>
    post(url: string, qs?: params, payload?: Object, callback?: ResultCb): Promise<Object>
    put(url: string, qs?: params, payload?: Object, callback?: ResultCb): Promise<Object>
    del(url: string, qs?: params, callback?: ResultCb): Promise<Object>
    multipartPost(url: string, qs?: params, formData?: Object, callback?: ResultCb): Promise<Object>
    download(url: string, qs?: params, callback?: ResultCb): Promise<Object>
    
    reauthenticate(reauthenticateFn: Function): void
    disconnect(callback: (err: string) => void): void
}

// Data objects

export declare interface Rows<T> {
    size: Number
    total_rows: Number
    offset: Number
    rows: Array<T>
}

export declare interface Pagination {
    skip?: Number,
    limit?: Number,
    sort?: Object,
    options?: Object,
    from?: string
}

export declare interface TypedID {
    _doc: string
    [key: string]: any
}

export declare interface PlatformObject extends TypedID {
    platformId: string
}

export declare interface RepositoryObject extends PlatformObject {
    repositoryId: string
}

export default interface Changeset extends RepositoryObject {
    revision: string
    branch: string
    active: boolean
    parents: string[]
    summary?: string
    tags?: string[]
}

export declare interface GraphQLResult {
    data?: Object
    errors?: Array<Object>
}

export declare interface Attachment {
    length: number
    contentType: string
    filename: string
    objectId: string
}

export declare interface TraversalResult {
    node: string
    config: Object
    node_count: Number
    nodes: {[id: string]: Node}
    associations: {[id: string]: Association}
}

export declare interface TreeConfig {
    leafPath?: string
    basePath?: string
    containers?: boolean
    depth?: Number
    properties?: boolean
    query?: Object
    search?: Object
}

export declare interface TreeElement {
    id: string
    repositoryId: string
    branchId: string
    rootNodeId: string

    // container
    container?: boolean
    children?: Array<TreeElement>
    childCount?: Number
    childContainerCount?: Number

    // file info
    filename: string
    label: string
    path: string

    description?: string
    typeQName?: string
    qname?: string
    properties?: Object
    _object?: Object
}


export declare interface NodeVersionOptions {
    excludeSystem?: boolean
    diff?: boolean
}

export declare interface StartJobResult {
    _doc: string
}

export declare type JobState = "NONE" | "WAITING" | "RUNNING" | "FINISHED" | "ERROR" | "PAUSED" | "AWAITING"

export declare interface Job extends TypedID {
    state: JobState
    type: string
}

// Archives

export declare interface Archive extends TypedID {
    type: string
    group: string
    artifact: string
    version: string
    contentType: string
    length: Number

    published?: boolean
}

export declare interface UploadArchiveOptions {
    group?: string
    artifact?: string
    version?: string
    type?: string
    title?: string
    description?: string
    published?: boolean
}

export declare interface TransferImportOpts {
    group: string
    artifact: string
    version: string
    vault?: string
}

export declare interface TransferExportOpts {
    group: string
    artifact: string
    version: string
    vault?: string
    title?: string
    description?: string
    published?: boolean
}

export declare interface TransferExportConfiguration {
    startDate?: Number
    endDate?: Number
    startChangeset?: string
    endChangeset?: string
    tipChangesetOnly?: boolean
    selectedBranchIds?: Array<string>
    includeACLs?: boolean
    includeTeams?: boolean
    includeTeamMembers?: boolean
    includeRoles?: boolean
    includeActivities?: boolean
    includeBinaries?: boolean
    includeAttachments?: boolean
    artifactParts?: Array<string>
    artifactIncludes?: Array<string>
    forceIncludes?: boolean
    contentIncludeFolders?: boolean
    contentIncludeRelators?: boolean
    contentIncludeRelatingAssociations?: boolean
    branchIncludeArchives?: boolean
    branchIncludeSnapshots?: boolean

    [key: string]: any
}

export declare interface TransferImportConfiguration {
    includeACLs?: boolean
    includeTeams?: boolean
    includeTeamMembers?: boolean
    includeRoles?: boolean
    includeActivities?: boolean
    includeBinaries?: boolean
    includeAttachments?: boolean
    strategy?: string
    substitutions?: params
    childrenOnly?: boolean
    includeSourceIds?: Array<string>
    properties?: Object
    dryRun?: boolean
    copyOnExisting?: boolean
    requireAllIncludes?: boolean
    autoCleanup?: boolean
    autoPublish?: boolean
    allowWriteToFrozenBranches?: boolean
    copyBinaries?: boolean
    copyAttachments?: boolean

    [key: string]: any
}

export declare interface PageRendition {
    path: string
    html: string
    title?: string
}

export declare interface Principal extends TypedID {
    name: string
    type: string
}

export declare interface DataStore extends PlatformObject {

}

export declare interface Stack extends PlatformObject {
    // readDataStore(key: string, callback?: ResultCb<DataStore>): Promise<DataStore>
    // listDataStores(callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
    // queryDataStores(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
    // findDataStoreStack(dataStoreType: string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>
    // assignDataStore(dataStore: string|DataStore, key: string, callback?: ResultCb<void>): Promise<void>
    // unassignDataStore(key: string, callback?: ResultCb<void>): Promise<void>
}

export declare interface Repository extends DataStore {
    // queryBranches(query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<Branch>>
    // readBranch(branch: TypedID|string, callback?: ResultCb<Branch>): Promise<Branch>
    // createBranch(branch: TypedID|string, changesetId?: string, obj?: Object, callback?: ResultCb<Branch>): Promise<Branch>
    // listBranches(callback?: ResultCb<Rows<Branch>>): Promise<Rows<Branch>>
}

export declare interface Application extends DataStore {
    
}

export declare interface Domain extends DataStore {
    // readPrincipal(principalId: string, callback?: ResultCb<Principal>): Promise<Principal>
    // queryPrincipals(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Principal>>): Promise<Rows<Principal>>
}

export declare interface Branch extends RepositoryObject {
    root: string
    tip: string
    snapshot: boolean
    archived: boolean
    type: string

    title?: string
    alias?: string
    readonly?: boolean
    frozen?: false

    // readNode(nodeId: string, path?: string, callback?: ResultCb<Node>): Promise<Node>
    // queryNodes(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // queryOneNode(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Node>
    // searchNodes(search: Object|string, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // findNodes(config: Object, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // createNode(obj?: Object, options?: Object, callback?: ResultCb<Node>): Promise<Node>
    // deleteNodes(nodes: string|Array<string>|Array<TypedID>, callback?: ResultCb<void>): Promise<void>

    // graphqlQuery(query: string, operationName?: string, variables?: Object, callback?: ResultCb<GraphQLResult>): Promise<GraphQLResult>
    // graphqlSchema(callback?: ResultCb<string>): Promise<string>

    // deleteBranch(callback?: ResultCb<void>): Promise<void>
    // updateBranch(obj: Object, callback?: ResultCb<Branch>): Promise<Branch>
    // resetBranch(changeset: string|TypedID, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>

    // trackPage(page: PageRendition): void
}

export declare interface Node extends TypedID {
    _qname: string
    _type: string

    // queryNodeRelatives(associationTypeQName: string, associationDirection: string, query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // queryNodeChildren(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // listNodeAssociations(associationType?: string, associationDirection?: string, pagination?: Pagination, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>
    // listOutgoingAssociations(associationType?: string, pagination?: Pagination, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>
    // listIncomingAssociations(associationType?: string, pagination?: Pagination, callback?: ResultCb<Rows<Association>>): Promise<Rows<Association>>
    // associate(otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<Association>): Promise<Association>
    // unassociate(otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<void>): Promise<void>
    // associateChild(childNode: TypedID|string, callback?: ResultCb<Association>): Promise<Association>
    // unassociateChild(childNode: TypedID|string, callback?: ResultCb<void>): Promise<void>
    // deleteNode(callback?: ResultCb<void>): Promise<void>
    // updateNode(callback?: ResultCb<Node>): Promise<Node>
    // patchNode(patchObject: Object, callback?: ResultCb<Node>): Promise<Node>
    // addNodeFeature(featureId: string, config?: Object, callback?: ResultCb<void>): Promise<void>
    // removeNodeFeature(featureId: string, callback?: ResultCb<void>): Promise<void>
    // refreshNode(callback?: ResultCb<void>): Promise<void>
    // changeNodeQName(newQName: string, callback?: ResultCb<Object>): Promise<Object>
    // nodeTree(config?: TreeConfig, callback?: ResultCb<TreeElement>): Promise<TreeElement>
    // resolveNodePath(callback?: ResultCb<{path: string}>): Promise<{path: string}>
    // resolveNodePaths(callback?: ResultCb<{[id: string]: string}>): Promise<{[id: string]: string}>
    // traverseNode(config: Object, callback?: ResultCb<TraversalResult>): Promise<TraversalResult>
    // uploadAttachment(attachmentId: string, file: File, mimeType: string, filename?: string, callback?: ResultCb<void>): Promise<void>
    // downloadAttachment(attachmentId: string, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
    // listAttachments(callback?: ResultCb<Rows<Attachment>>): Promise<Rows<Attachment>>
    // deleteAttachment(attachmentId?: string, callback?: ResultCb<void>): Promise<void>
    // listVersions(options?: NodeVersionOptions, pagination?: Pagination, callback?: ResultCb<Rows<Node>>): Promise<Rows<Node>>
    // readVersion(changesetId: string, options?: NodeVersionOptions, callback?: ResultCb<Node>): Promise<Node>
    // restoreVersion(changesetId: string, callback?: ResultCb<Node>): Promise<Node>
}

export declare interface Association extends Node {
    source: string
    source_type: string
    target: string, 
    target_type: string
    directionality: "DIRECTED" | "UNDIRECTED"
}


export declare interface ChangesetHistoryConfig {
    root?: string,
    tip?: string,
    include_root?: boolean,
    view?: string
}

export declare interface DownloadJobOptions {
    a?: boolean,
    filename?: string
}

export type BranchChangesView = "editorial" | "editorial-pull" | undefined;

export declare interface BranchChangesOptions {
    view?: BranchChangesView,
    filter?: string,
    source?: boolean,
    target?: boolean,
    force?: boolean,
}

export declare interface SyncNodesConfig {
    includeAllAssociations?: boolean,
    includeRelators?: boolean,
    forceDelete?: boolean,
    allowWriteToFrozenBranches?: boolean,
    optionalAssociationsMaxDepth?: number,
    excludeAssociationTypes?: boolean,
}


// Sessions

export declare interface Session {
    config: DriverConfig
    driver: Driver

    sleep(ms: Number, callback?: ResultCb<void>): Promise<void>
    stringify(obj: Object, pretty: boolean): string
    parse(text: string): Object
    refresh(callback?: (err: Error) => void): Promise<void>
    disconnect(callback?: (err: Error) => void): Promise<void>
    reauthenticate(reauthenticateFn: Function): void
}

export declare interface ApplicationSession extends Session {
    readApplication(application: (TypedID | string), callback?: ResultCb<Application>): Promise<Application>
}

export declare interface RepositorySession extends Session {
    buildRepositoryReference(repository: TypedID|string, callback?: ResultCb<string>): Promise<string>
    createRepository(obj?: Object, callback?: ResultCb<Repository>): Promise<Repository>
    queryRepositories(query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<Repository>>): Promise<Rows<Repository>>
}

export declare interface BranchSession extends Session {
    buildBranchReference(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<string>): Promise<string>
    queryBranches(repository: TypedID|string, query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<Branch>>
    readBranch(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<Branch>): Promise<Branch>
    createBranch(repository: TypedID|string, branch: TypedID|string, changesetId?: string, obj?: Object, callback?: ResultCb<Branch>): Promise<Branch>
    listBranches(repository: TypedID|string, pagination?: Pagination, callback?: ResultCb<Rows<Branch>>): Promise<Rows<Branch>>
    deleteBranch(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<void>): Promise<void>
    updateBranch(repository: TypedID|string, branch: TypedID|string, obj: Object, callback?: ResultCb<Branch>): Promise<Branch>
    resetBranch(repository: TypedID|string, branch: TypedID|string, changeset: string|TypedID, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    startChangesetHistory(repository: TypedID|string, branch: TypedID|string, config?: ChangesetHistoryConfig): Promise<StartJobResult>
    startBranchChanges(repository: TypedID|string, sourceBranch: TypedID|string, targetBranch: TypedID|string, pagination?: Pagination, opts?: BranchChangesOptions, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    invalidateBranchChanges(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<void>): Promise<void>
    exportBranchChanges(repository: TypedID|string, sourceBranch: TypedID|string, targetBranch: TypedID|string, view?: BranchChangesView, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
}

export declare interface DomainSession extends Session {
    createDomain(obj?: Object, callback?: ResultCb<Domain>): Promise<Domain>
    queryDomains(query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<Domain>>): Promise<Rows<Domain>>
    readDomain(domainId: string, callback?: ResultCb<Domain>): Promise<Domain>
}

export declare interface GraphQLSession extends Session {
    graphqlQuery(repository: TypedID|string, branch: TypedID|string, query: string, operationName?: string, variables?: Object, callback?: ResultCb<GraphQLResult>): Promise<GraphQLResult>
    graphqlSchema(repository: TypedID|string, branch: TypedID|string, callback?: ResultCb<string>): Promise<string>
}

export declare interface NodeSession extends Session {
    readNode<T = Node>(repository: TypedID|string, branch: TypedID|string, nodeId: string, path?: string, callback?: ResultCb<T & Node>): Promise<T & Node>
    queryNodes<T = Node>(repository: TypedID|string, branch: TypedID|string, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
    queryOneNode<T = Node>(repository: TypedID|string, branch: TypedID|string, query: Object, pagination?: Pagination, callback?: ResultCb<T & Node | null>): Promise<T & Node | null>
    searchNodes<T = Node>(repository: TypedID|string, branch: TypedID|string, search: Object|string, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
    findNodes<T = Node>(repository: TypedID|string, branch: TypedID|string, config: Object, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
    createNode<T = Node>(repository: TypedID|string, branch: TypedID|string, obj?: Object, options?: Object, callback?: ResultCb<T & Node>): Promise<T & Node>
    deleteNodes(repository: TypedID|string, branch: TypedID|string, nodes: string|Array<string>|Array<TypedID>, callback?: ResultCb<void>): Promise<void>
    updateNodes(repository: TypedID|string, branch: TypedID|string, nodes: Array<TypedID>, callback?: ResultCb<void>): Promise<void>

    queryNodeRelatives<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationTypeQName: string, associationDirection: string, query?: Object, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
    queryNodeChildren<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<T>>): Promise<Rows<T & Node>>
    listNodeAssociations<T = Association>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, associationDirection?: string, pagination?: Pagination, callback?: ResultCb<Rows<T & Association>>): Promise<Rows<T & Association>>
    listOutgoingAssociations<T = Association>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Pagination, callback?: ResultCb<Rows<T & Association>>): Promise<Rows<T & Association>>
    listIncomingAssociations<T = Association>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, associationType?: string, pagination?: Pagination, callback?: ResultCb<Rows<T & Association>>): Promise<Rows<T> & Association>
    associate<T = Association>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<T & Association>): Promise<T & Association>
    unassociate(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, otherNode: TypedID|string, associationType?: string, associationDirectionality?: string, callback?: ResultCb<void>): Promise<void>
    associateChild<T = Association>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string, callback?: ResultCb<T & Association>): Promise<T & Association>
    unassociateChild(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, childNode: TypedID|string, callback?: ResultCb<void>): Promise<void>
    deleteNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<void>): Promise<void>
    updateNode<T = Node>(repository: TypedID|string, branch: TypedID|string, node: T & TypedID, callback?: ResultCb<T & Node>): Promise<T & Node>
    patchNode<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, patchObject: Object, callback?: ResultCb<T & Node>): Promise<T & Node>
    addNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string, config?: Object, callback?: ResultCb<void>): Promise<void>
    removeNodeFeature(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, featureId: string, callback?: ResultCb<void>): Promise<void>
    refreshNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<void>): Promise<void>
    changeNodeQName(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, newQName: string, callback?: ResultCb<Object>): Promise<Object>
    nodeTree(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config?: TreeConfig, callback?: ResultCb<TreeElement>): Promise<TreeElement>
    resolveNodePath(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<{path: string}>): Promise<string>
    resolveNodePaths(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<{[id: string]: string}>): Promise<{[id: string]: string}>
    moveNodes(repository: TypedID|string, branch: TypedID|string, sourceNodeIds: Array<string>, targetNodeId: string, options?: Object): Promise<void>
    traverseNode(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, config: Object, callback?: ResultCb<TraversalResult>): Promise<TraversalResult>
    uploadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string, file: File, mimeType: string, filename?: string, callback?: ResultCb<void>): Promise<void>
    downloadAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId: string, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
    listAttachments(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, callback?: ResultCb<Rows<Attachment>>): Promise<Rows<Attachment>>
    deleteAttachment(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, attachmentId?: string, callback?: ResultCb<void>): Promise<void>
    listVersions<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, options?: NodeVersionOptions, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
    readVersion<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, changesetId: string, options?: NodeVersionOptions, callback?: ResultCb<T & Node>): Promise<T & Node>
    restoreVersion<T = Node>(repository: TypedID|string, branch: TypedID|string, node: TypedID|string, changesetId: string, callback?: ResultCb<T & Node>): Promise<T & Node>
    startCopyNodes(repository: TypedID|string, sourceBranch: TypedID|string, targetBranch: TypedID|string, nodeIds: Array<string>, config?: SyncNodesConfig, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
}

export declare interface PrincipalSession extends Session {
    readPrincipal(domain: TypedID|string, principalId: string, callback?: ResultCb<Principal>): Promise<Principal>
    queryPrincipals(domain: TypedID|string, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Principal>>): Promise<Rows<Principal>>
    createPrincipal(domain: TypedID|string, obj: Object, callback?: ResultCb<Principal>): Promise<Principal>
    updatePrincipal(domain: TypedID|string, principal: Principal, callback?: ResultCb<void>): Promise<void>
}

export declare interface ProjectSession extends Session {
    buildProjectReference(project: TypedID|string, callback?: ResultCb<string>): Promise<string>
    readProject(project: TypedID|string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>
    deleteProject(project: TypedID|string, callback?: ResultCb<void>): Promise<void>
    updateProject(project: TypedID, callback?: ResultCb<void>): Promise<void>
    queryProjects(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<PlatformObject>>): Promise<Rows<PlatformObject>>
    startCreateProject(obj: Object, callback?: ResultCb<StartJobResult>):  Promise<StartJobResult>
    listProjectTypes(pagination?: Pagination, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
}

export declare interface StackSession extends Session {
    readStack(stack: TypedID|string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>
    readDataStore(stack: TypedID|string, key: string, callback?: ResultCb<DataStore>): Promise<DataStore>
    listDataStores(stack: TypedID|string, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
    queryDataStores(stack: TypedID|string, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
    findDataStoreStack(dataStore: string|DataStore, dataStoreType: string, callback?: ResultCb<PlatformObject>): Promise<PlatformObject>
    assignDataStore(stack: TypedID|string, dataStore: string|DataStore, type: string, key: string, callback?: ResultCb<void>): Promise<void>
    unassignDataStore(stack: TypedID|string, key: string, callback?: ResultCb<void>): Promise<void>
}

export declare interface WorkflowSession extends Session {
    readWorkflow(workflowId: string, callback?: ResultCb<TypedID>): Promise<TypedID>
    deleteWorkflow(workflowId: string, callback?: ResultCb<TypedID>): Promise<TypedID>
    queryWorkflows(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
    queryWorkflowTasks(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<TypedID>>): Promise<Rows<TypedID>>
}

export declare interface ChangesetSession extends Session {
    readChangeset(repository: string|TypedID, changeset: string|TypedID, callback?: ResultCb<Changeset>): Promise<Changeset>
    queryChangesets(repository: string|TypedID, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Changeset>>): Promise<Rows<Changeset>>
    listChangesets(repository: string|TypedID, pagination?: Pagination, callback?: ResultCb<Rows<Changeset>>): Promise<Rows<Changeset>>
    listChangesetNodes<T = Node>(repository: string|TypedID, changeset: string|TypedID, pagination?: Pagination, callback?: ResultCb<Rows<T & Node>>): Promise<Rows<T & Node>>
}

export declare interface JobSession extends Session {
    readJob(jobId: string|TypedID, callback?: ResultCb<Job>): Promise<Job>
    queryJobs(query: Object, pagination?: Pagination, callback?: ResultCb<Rows<Job>>): Promise<Rows<Job>>
    killJob(jobId: string|TypedID, callback?: ResultCb<Job>): Promise<Job>
    downloadJobAttachment(jobId: string|TypedID, attachmentId?: string, opts?: DownloadJobOptions, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
    waitForJobCompletion(job: string|TypedID, callback?: ResultCb<Job>): Promise<Job>
}

export declare interface TransferSession extends Session {
    exportArchive(sourceRefs: Array<string>|string, opts: TransferExportOpts, configuration: TransferExportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    exportNodes(repository: TypedID|string, branch: TypedID|string, nodes: Array<string|TypedID>|string|TypedID, opts: TransferExportOpts, configuration: TransferExportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    exportProject(project: string|TypedID, opts: TransferExportOpts, configuration: TransferExportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    importArchive(targetRef: string, opts: TransferImportOpts, configuration: TransferImportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    importArchiveToBranch(repository: TypedID|string, branch: TypedID|string, opts: TransferImportOpts, configuration: TransferImportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    importArchiveToRepository(repository: TypedID|string, opts: TransferImportOpts, configuration: TransferImportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    importArchiveToPlatform(opts: TransferImportOpts, configuration: TransferImportConfiguration, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
}

export declare interface ArchiveSession extends Session {
    readArchive(archive: string|TypedID, vault?: string|TypedID, callback?: ResultCb<Archive>): Promise<Archive>
    updateArchive(archive: Archive, vault?: string|TypedID, callback?: ResultCb<Archive>): Promise<TypedID>
    deleteArchive(archive: string|TypedID, vault?: string|TypedID, callback?: ResultCb<void>): Promise<void>
    lookupArchive(group: string, artifact: string, version: string, vault?: string|TypedID, callback?: ResultCb<Archive>): Promise<Archive>
    queryArchives(query: Object, pagination?: Pagination, vault?: string|TypedID, callback?: ResultCb<Rows<Archive>>): Promise<Rows<Archive>>
    
    /**
     * Uploads an archive ZIP file to Cloud CMS.
     * The uploaded archive will not be imediately available for use, you may need to poll the archive until is ready for use.
     */
    uploadArchive(opts: UploadArchiveOptions, file: File, fileName: string, vault?: string|TypedID,  callback?: ResultCb<TypedID>): Promise<TypedID>
    downloadArchiveById(archive: string|TypedID, vault?: string|TypedID, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
    downloadArchive(group: string, artifact: string, version: string, vault?: string|TypedID, callback?: ResultCb<NodeJS.ReadStream>): Promise<NodeJS.ReadStream>
}

export declare interface TrackerSession extends Session {
    trackPage(repositoryId: string, branchId: string, page: PageRendition): void
}

export declare interface ReleaseSession extends Session {
    startCreateRelease(repository: string|TypedID, object: Object, sourceRelease?: string|TypedID, callback?: ResultCb<StartJobResult>): Promise<StartJobResult>
    readRelease(repository: string|TypedID, releaseId: string, callback?: ResultCb<RepositoryObject>): Promise<RepositoryObject>
    updateRelease(repository: string|TypedID, release: string|TypedID, obj: Object, callback?: ResultCb<void>): Promise<void>
    deleteRelease(repository: string|TypedID, release: string|TypedID, callback?: ResultCb<void>): Promise<void>
    queryReleases(repository: string|TypedID, query: Object, pagination?: Pagination, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<RepositoryObject>>
    listReleases(repository: string|TypedID, pagination?: Pagination, callback?: ResultCb<Rows<RepositoryObject>>): Promise<Rows<RepositoryObject>>
}

export declare interface PlatformSession extends Session {
    readPlatform(callback?: ResultCb<TypedID>): Promise<TypedID>
    getPlatformId(callback?: ResultCb<string>): Promise<string>
    buildPlatformReference(callback?: ResultCb<string>): Promise<string>
}

export declare interface UtilitySession extends DefaultSession {
    new(config: DriverConfig, driver: Driver, storage: Object): UtilitySession
    application(): Promise<Application>
    project(): Promise<PlatformObject>
    stack(): Promise<Stack>
    dataStores(): Promise<Array<DataStore>>
    dataStoresByKey(): Promise<{[key: string]: DataStore}>
    repository(): Promise<Repository>
    branches(): Promise<Array<Branch>>
    branchesById(): Promise<{[id: string]: Branch}>
    branchesByTitle(): Promise<{[title: string]: Branch}>
    master(): Promise<Branch>
}


export declare type DefaultSession = ApplicationSession & ArchiveSession & RepositorySession & BranchSession & DomainSession & GraphQLSession & NodeSession & PrincipalSession & ProjectSession & StackSession & WorkflowSession & ChangesetSession & JobSession & TransferSession & TrackerSession & ReleaseSession & PlatformSession;




