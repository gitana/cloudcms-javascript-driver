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

describe('attachment20', function () {
    it('should run node test without error using object bound functions', async function () {

        try {
            var session = await CloudCMS.connect();

            var repository = await session.createRepository();
            var master = await repository.readBranch("master");

            var attachment = fs.readFileSync(__dirname + "/cloudcms.png");


            // Upload an attachment and download it
            var node = await master.createNode({ "title": "my node" });
            await node.uploadAttachment("default", attachment, "image/png", "cloudcms.png");

            var stream = await node.downloadAttachment("default")
            var downloaded = await streamToData(stream);
            
            assert.deepEqual(attachment, downloaded);

            // List attachments
            var attachments = await node.listAttachments();
            assert.equal(1, attachments.size);

            // Delete attachment
            await node.deleteAttachment("default");
            attachments = await node.listAttachments();
            assert.equal(0, attachments.size);

            var err = null;
            var stream2: NodeJS.ReadStream|null = null;
            try {
                stream2 = await node.downloadAttachment("default");
            } catch (e: any)
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