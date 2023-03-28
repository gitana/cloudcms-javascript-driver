import * as CloudCMS from "../..";
var assert = require('chai').assert;
var fs = require("fs");
var path = require("path");



function streamToData (stream: NodeJS.ReadStream) {
    const chunks = Array<any>();
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
  }

describe('archive10', function () {
    it('should run archive test without error', async function () {

      try
      {
        var session = await CloudCMS.connect();
        
        var vaultId = "primary";
        var archiveName = "org.gitana.sample-sample-project-2.3.9.zip";
        var archiveFile = fs.readFileSync(path.resolve(__dirname, archiveName));
        var res = await session.uploadArchive(vaultId, {}, archiveFile, archiveName);
        var archiveId = res._doc;

        await session.sleep(1000);

        var archive = await session.readArchive(vaultId, archiveId);
        assert.isNotNull(archive);

        archive = await session.lookupArchive(vaultId, "org.gitana.sample", "sample-project", "2.3.9");
        assert.isNotNull(archive);

        var archives = await session.queryArchives(vaultId, {});
        assert.isAbove(archives.rows.length, 0);

        var dl1 = await session.downloadArchiveById(vaultId, archiveId);
        var buff = await streamToData(dl1);
        assert.deepEqual(archiveFile, buff);

        var dl2 = await session.downloadArchive(vaultId, "org.gitana.sample", "sample-project", "2.3.9");
        buff = await streamToData(dl2);
        assert.deepEqual(archiveFile, buff);

        await session.deleteArchive(vaultId, archiveId);
        var ex = null;
        try
        {
          archive = await session.readArchive(vaultId, archiveId);
        }
        catch (e: any)
        {
          ex = e;
        }
        assert.isNotNull(ex);
      }
      catch (err)
      {
        console.error(err);
        throw err;
      }
    });
});