<div align="center">
    <h1>Fappu's Price Tracker | <em>Backend</em></h1>
    <small>Stack used:</small>
    <div style="display: flex; justify-content: center; width: 300px; margin: 0 auto; background: transparent; padding: 0; list-style: none;">
    <span style="padding: 0; margin-right: 5px;">
        <img src="https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/jest/jest-plain.svg" style="width: 35px; ">
    </span>
    <span style="padding: 0; margin-right: 5px;">
        <img src="https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/nodejs/nodejs-original.svg" style="width: 35px; height: 35px; ">
    </span>
    <span style="padding: 0; margin-right: 5px;">
        <img src="https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/puppeteer/puppeteer-original.svg" style="width: 35px; height: 35px; overflow: hidden;">
    </span>
    <span style="padding: 0;">
        <img src="https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/express/express-original.svg" style="width: 35px; height: 35px; overflow: hidden;">
    </span>
    </div>
</div>

## Description
*Fappu's Price Tracker* is a specialized front- and backend project used to scrape *certain* websites to get the best bang for the buck. It includes a frontend to view the scraped data in an eye-catching, stylish website which might be used to view the data in different perspectives. The backend, on the other hand, is responsible for the web server and the scraping, parsing, and posterior transformation of data.

## Usage
### Install Dependencies
To begin, let's install all of the **npm** dependencies:

```bash
/PROJECT-DIRECTORY$ npm install
```

### Server
To initialize the web server, simply type in the following line in your terminal of choice:

```bash
/PROJECT-DIRECTORY$ npm run dev
```

### Commands
The codebase is intended to be used in the form of commands that are executed in the terminal of your choice. One example could be as follows:

```shell
/PROJECT-DIRECTORY$ node scrap-new-link.js WEBSITE
```

Some files can take parameters to decide what and where to execute a given process. One clear example of this is when using the `scrap-new-link.js` which will require a single parameter passed as an uppercase string of a given website that already exists within `/collections` (passing a non-existing website name yields an error).

## Getting Started
### Creating missing directories
Since git ignores empty directories, it is necessary to create two missing directories whose content is not tracked by git. These `/txt` and `/collections`. You can create them using the following command:

```bash
/PROJECT-DIRECTORY$ mkdir txt collections backup
```

### Creating a new website
The process to create a new website is simple. This consists of using the `create-new-website.js` command followed by the name of the given website in UPPERCASE just as follows:

```shell
/PROJECT-DIRECTORY$ node create-new-website.js WEBSITE
```

This should create three new files under different directories (these files are local and ignored by Git). Thus, your directory tree should look something like this:

```bash
/...
/collections
    WEBSITE.json
/info
    WEBSITE_info.json
/txt
    WEBSITE_links.txt
```

Great, now we can move on to scraping some data!

<h4>REMEMBER TO FILL THE TXT FILE FIRST!</h4>
<small>Don't forget to fill in some valid urls into <code>/txt/WEBSITE_links.txt</code> before trying to scrape something!</small>

### Scraping
There will be two main commands used for data scraping:
- `scrap-new-link.js` - Used to add a new record into a collection file
- `scrap-new-set.js` - Used to scrap data from an already existing entry

<h4>Scraping a new link</h4>
Let's begin running the first command (remember, `WEBSITE` MUST match the name of the text file previously created):

```shell
/PROJECT-DIRECTORY$ node scrap-new-link.js WEBSITE
```

This command will look up a text file under `/txt` named `WEBSITE_links.txt` and read each line as a new link address. Then it will try to run a puppeter session over the browser currently in use in the `.env` variable `BROWSER_PATH`. After it correctly detects a valid web page, it will try to read and parse data; if it succeeds, this newly scraped data will be transformed further into the valid format to be stored inside `/collections/WEBSITE.json`.

If the whole process runs without errors, the terminal window should display something similar to the next example:

```json
[
    {
        "duration": "5",
        "type": "Year",
        "price": "199.99",
        "includesDownloads": true
    },
    {
        "duration": "1",
        "type": "Year",
        "price": "89.99",
        "includesDownloads": true
    },
    {
        "duration": "1",
        "type": "Month",
        "price": "9.99",
        "includesDownloads": false
    },
    {
        "duration": "2",
        "type": "Day",
        "price": "1.00",
        "includesDownloads": false
    }
]
```

This is the data that gets appended into each collection record.

<h4>Scraping a new set</h4>

Sets are what gets posteriorly scraped once there are records inside a collection file. For this we'll use the `scrap-new-set.js` command with the following syntax:

```shell
/PROJECT-DIRECTORY$ node create-new-set.js WEBSITE START <END>
```

This command takes up to three parameters: the first one is self-explanatory `WEBSITE`, which refers to the collections file with the same name as this parameter; the second one, `START` is the record number where the command should begin to scrape a new set of data; and the last one `END` is an OPTIONAL last parameter that marks the final record number that will be scraped. When omitted, the command will solely try to scrape a single set from the record designated by the `START` parameter.

The output should be the same as when using `scrap-new-link.js` with the addition of multiple sets of scraped data being printed to screen.
