
const DefaultSession = require("../default/session");

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

        return this._application;
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

        return this._stack;
    }

    async dataStores()
    {
        if (!this._dataStores)
        {
            const stack = await this.stack();
            this._dataStores = (await this.listDataStores(stack)).rows;
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
                this._dataStoresByKey[dataStore._stackKey] = dataStore;
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
        }

        return this._repository;
    }

    async branches()
    {
        if (!this._branches)
        {
            const repository = await this.repository();
            this._branches = await repository.listBranches();
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

    async branchesById()
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
            this._master = await repository.readBranch("master");
        }

        return this._master;
    }
}

module.exports = UtilitySession;