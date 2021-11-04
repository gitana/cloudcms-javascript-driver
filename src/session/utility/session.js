
const DefaultSession = require("../default/session");
const Application = require("../../objects/Application");
const Stack = require("../../objects/Stack");
const Domain = require("../../objects/Domain");
const Repository = require("../../objects/Repository");
const Branch = require("../../objects/Branch");

const wrapDataStore = (session, obj) => {

    if (!obj.datastoreTypeId)
    {
        return obj;
    }
    else if (obj.datastoreTypeId === "repository")
    {
        return new Repository(session, obj);
    }
    else if (obj.datastoreTypeId === "application")
    {
        return new Application(session, obj);
    }
    else if (obj.datastoreTypeId === "domain")
    {
        return new Domain(session, obj);
    }
    else
    {
        return obj;
    }
}

class UtilitySession extends DefaultSession
{
    
    constructor(config, driver, storage)
    {
        super(config, driver, storage);
    }

    async application()
    {
        if (!this._application)
        {
            this._application = await this.readApplication(this.config.application);
        }

        return new Application(this, this._application);
    }
    
    async project()
    {
        if (!this._project)
        {
            const application = await this.application();
            this._project = await this.readProject(application.projectId);
        }

        return this._project;
    }

    async stack()
    {
        if (!this._stack)
        {
            const project = await this.project();
            this._stack = await this.readStack(project.stackId)
        }

        return new Stack(this, this._stack);
    }

    async dataStores()
    {
        if (!this._dataStores)
        {
            const stack = await this.stack();
            this._dataStores = (await this.listDataStores(stack)).rows;
            this._dataStores = this._dataStores.map(dataStore => wrapDataStore(this, dataStore));
        }

        return this._dataStores;
    }

    async dataStoresByKey()
    {
        if (!this._dataStoresByKey)
        {
            const dataStores = await this.dataStores();
            this._dataStoresByKey = {};
            for (let dataStore of dataStores)
            {
                this._dataStoresByKey[dataStore._doc] = dataStore;
            }
        }
        

        return this._dataStoresByKey;
    }

    async repository()
    {
        if (!this._repository)
        {
            const dataStoresByKey = await this.dataStoresByKey();
            this._repository = dataStoresByKey.content;
            // make sure repository id is accurate
            this._repository._stackKey = this._repository._doc;
            this._repository._doc = this._repository.datastoreId;
        }

        return this._repository;
    }

    async branches()
    {
        if (!this._branches)
        {
            const repository = await this.repository();
            this._branches = (await this.listBranches(repository)).rows;
            this._branches = this._branches.map(branch => new Branch(this, repository._doc, branch));
        }

        return this._branches;
    }

    async branchesById()
    {
        if(!this._branchesById)
        {
            const branches = await this.branches();
            this._branchesById = {};
            for (let branch of branches)
            {
                this._branchesById[branch._doc] = branch;
            }
        }

        return this._branchesById;
    }

    async branchesByTitle()
    {
        if(!this._branchesByTitle)
        {
            const branches = await this.branches();
            this._branchesById = {};
            for (let branch of branches)
            {
                this._branchesById[branch.title] = branch;
            }
        }

        return this._branchesById;
    }

    async master()
    {
        if (!this._master)
        {
            const repository = await this.repository();
            this._master = await this.readBranch(repository, "master");
            this._master = new Branch(this, repository._doc, this._master);
        }

        return this._master;
    }
}

module.exports = UtilitySession;