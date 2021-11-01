module.exports = function(Session)
{

    class UtilitySession extends Session
    {
        
        constructor(config, driver, storage)
        {
            super(config, driver, storage);

            this.session = await cloudcms.connect(this.gitanaConfig);

            // this.repository = this.dataStoresById.content;
            // this.repository._doc = this.repository.datastoreId;
            // this.branchList = await this.session.listBranches(this.repository);
            // this.branchesById = _.indexBy(this.branchList.rows, '_doc');
            // this.branchesByTitle = _.indexBy(this.branchList.rows, 'title');
            // this.branch = await this.session.readBranch(this.repository.datastoreId, this.option_branchId);
            // this.master = await this.session.readBranch(this.repository.datastoreId, "master");
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
                this._dataStores = await this.listDataStores(stack);
            }

            return this._dataStores;
        }

        async dataStoresById()
        {
            if (!this._dataStoresById)
            {
                const dataStores = await this.dataStores();
                this._dataStoresById = {};
                for (let dataStore of dataStores)
                {
                    this._dataStoresById[dataStore._doc] = dataStore;
                }
            }
            

            return this._dataStoresById;
        }

        async repository()
        {
            if (!this._repository)
            {
                const dataStoresById = await this.dataStoresById();
                this._repository = dataStoresById.content;
                this._repository._doc = this._repository.datastoreId;
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

    return UtilitySession;
};
