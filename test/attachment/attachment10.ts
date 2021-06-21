import * as CloudCMS from "../..";
var assert = require('chai').assert;
var fs = require("fs");



function streamToData (stream: NodeJS.ReadStream) {
    const chunks = Array<any>();
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
  }

describe('attachment10', function () {
    it('should run node test without error', async function () {

        try {
            var session = await CloudCMS.connect();

            var repository = await session.createRepository();
            var branchId = "master";

            var attachment = fs.readFileSync(__dirname + "/cloudcms.png");


            // Upload an attachment and download it
            var node = await session.createNode(repository, branchId, { "title": "my node" });
            await session.uploadAttachment(repository, branchId, node, "default", attachment, "image/png", "cloudcms.png");

            var stream = await session.downloadAttachment(repository, branchId, node, "default")
            var downloaded = await streamToData(stream);
            
            assert.deepEqual(attachment, downloaded);

            // List attachments
            var attachments = await session.listAttachments(repository, branchId, node);
            assert.equal(1, attachments.size);

            // Delete attachment
            await session.deleteAttachment(repository, branchId, node, "default");
            attachments = await session.listAttachments(repository, branchId, node);
            assert.equal(0, attachments.size);

            var err = null;
            var stream2: NodeJS.ReadStream|null = null;
            try {
                stream2 = await session.downloadAttachment(repository, branchId, node, "default");
            } catch (e)
            {
                err = e;
            }

            assert.isNull(stream2);
            assert.isNotNull(err);

        } catch (error) {
            console.error(error);
        }
        
    });
});