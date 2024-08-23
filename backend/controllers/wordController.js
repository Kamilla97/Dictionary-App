const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');

const Word = require('../models/Word');
const WordStatistics = require('../models/WordStatistics');
const LikeDislikeLog = require('../models/LikeDislikeLog');
const Meaning = require('../models/Meaning'); // Import the Meaning model
const Definition = require('../models/Definition'); // Import the Definition model
const User = require('../models/User'); // Import the User model


const MAX_ACTIONS_PER_IP = 1; // Max likes/dislikes allowed per word per IP within the timeframe
const TIMEFRAME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getIpAddress = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};



exports.searchWords = async (req, res) => {
    const query = req.query.query; // Get the query from request parameters

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Search words by headword, meanings, or definitions
        const words = await Word.findAll({
            where: {
                headword: {
                    [Op.like]: `%${query}%`, // Search for words that contain the query
                },
            },
            include: [
                { model: WordStatistics, as: 'statistics' },
                {
                    model: Meaning,
                    as: 'meanings',
                    include: [
                        {
                            model: Definition,
                            as: 'definitions',
                        },
                    ],
                },
                {
                    model: User, as: 'user',
                    attributes: ['username']
                }
            ],
        });

        // If words are found in the database, return them
        if (words.length > 0) {
            return res.json(words); // End the response here
        }

        console.log("Fetching from external API");
        const fetch = (await import('node-fetch')).default;

        // If the word does not exist, make a request to the external API
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
        const apiResponse = await fetch(apiUrl);

        if (!apiResponse.ok) {
            return res.status(404).json({ error: `Word not found in external API: ${query}` });
        }

        const apiWordData = await apiResponse.json();
        const apiWord = apiWordData[0]; // Take the first entry from the API response

        // Check if the response contains the expected properties
        if (!apiWord || !apiWord.word || !apiWord.meanings) {
            return res.status(400).json({ error: 'Invalid response from external API' });
        }


        let audioUrl = null;
        if (apiWord.phonetics && Array.isArray(apiWord.phonetics)) {
            // Find the first phonetic with a valid audio URL
            const phoneticWithAudio = apiWord.phonetics.find(phonetic => phonetic.audio && phonetic.audio.trim() !== '');
            if (phoneticWithAudio) {
                audioUrl = phoneticWithAudio.audio;
            }
        }

        console.log("Selected audio URL: ", audioUrl);

        // Insert the word into the database
        const newWord = await Word.create({
            headword: apiWord.word,
            pronunciation: apiWord.phonetic || null,
            origin: apiWord.origin || null,
            status: 'approved', // Auto-approve words from the external API
            mp3Url: audioUrl || null, // Use the selected audio URL, or null if none found
            userId: req.user ? req.user.id : 1 // Assign a default user or logged-in user
        });

        // Insert meanings and definitions into the database
        for (const meaningData of apiWord.meanings) {
            const newMeaning = await Meaning.create({
                partOfSpeech: meaningData.partOfSpeech,
                wordId: newWord.id
            });

            for (const definitionData of meaningData.definitions) {
                await Definition.create({
                    definition: definitionData.definition,
                    example: definitionData.example || null, // Default to null if no example is provided
                    synonyms: Array.isArray(definitionData.synonyms) && definitionData.synonyms.length > 0 ? definitionData.synonyms : null, // Check if it's an array with values
                    antonyms: Array.isArray(definitionData.antonyms) && definitionData.antonyms.length > 0 ? definitionData.antonyms : null, // Same for antonyms
                    meaningId: newMeaning.id
                });
            }
        }

        // Optionally create WordStatistics for the new word
        await WordStatistics.create({
            wordId: newWord.id,
            likes: 0,
            dislikes: 0,
            views: 0
        });

        // Fetch the word with all its associations to return to the client
        const savedWord = await Word.findOne({
            where: { id: newWord.id },
            include: [
                { model: WordStatistics, as: 'statistics' },
                {
                    model: Meaning,
                    as: 'meanings',
                    include: [{ model: Definition, as: 'definitions' }]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }
            ]
        });

        return res.json([savedWord]); // Only send this response if the word is fetched from the external API
    } catch (error) {
        console.error('Error fetching search results:', error);
        return res.status(500).json({ error: 'Failed to fetch search results' });
    }
};


exports.wordsToManage = async (req, res) => {
    try {
        const ipAddress = getIpAddress(req); // Get the user's IP address
        let role = "";
        let userId;
        if (req.headers.authorization) {
            const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);
            role = decoded.role;
            if (role == "contributor") {
                userId = decoded.id;
            }
        }

        // Pagination parameters from the query string
        const { page = 1, limit = 10 } = req.query;

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Use the static method from the model to fetch words with interaction data, paginated
        const { rows: words, count: totalItems } = await Word.getAllWordsWithInteraction(ipAddress, role, userId, limit, offset);

        // Return the paginated result along with meta information
        res.json({
            words,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllWords = async (req, res) => {
    try {
        const ipAddress = getIpAddress(req); // Get the user's IP address

        let isAdmin = false;
        if (req.headers.authorization) {

            const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);


            if (decoded.role == "admin")
                isAdmin = true;
        }

        // Use the static method from the model to fetch words with interaction data
        const words = await Word.getAllWordsWithInteraction(ipAddress, isAdmin);

        res.json(words);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getWordById = async (req, res) => {
    try {
        // Include Meanings, Definitions, and WordStatistics
        const word = await Word.findByPk(req.params.id, {
            include: [
                { model: WordStatistics },
                {
                    model: Meaning, as: 'meanings',
                    include: [
                        { model: Definition, as: 'definitions' } // Include Definitions
                    ]
                }
            ]
        });
        if (word) {
            res.json(word);
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch word' });
    }
};

// Initialize Google Cloud Storage


exports.likeWord = async (req, res) => {
    try {
        const { wordId } = req.params;
        const ipAddress = getIpAddress(req);

        // Ensure WordStatistics exists for the word
        let wordStatistics = await WordStatistics.findOne({ where: { wordId } });
        if (!wordStatistics) {
            // If no statistics exist, create an initial record
            wordStatistics = await WordStatistics.create({ wordId, likes: 0, dislikes: 0, views: 0 });
        }

        // Check if the user has already liked the word
        const existingLikeLog = await LikeDislikeLog.findOne({
            where: {
                wordId,
                ipAddress,
                action: 'like',
            }
        });

        if (existingLikeLog) {
            // If already liked, remove the like
            await existingLikeLog.destroy();
            wordStatistics.likes -= 1;
            await wordStatistics.save();

            return res.status(200).json({ message: 'Like removed successfully', likes: wordStatistics.likes });
        }

        // If the word was previously disliked, remove the dislike
        const existingDislikeLog = await LikeDislikeLog.findOne({
            where: {
                wordId,
                ipAddress,
                action: 'dislike',
            }
        });

        if (existingDislikeLog) {
            await existingDislikeLog.destroy();
            wordStatistics.dislikes -= 1;
            await wordStatistics.save();
        }

        // Log the like action
        await LikeDislikeLog.create({ wordId, ipAddress, action: 'like' });

        // Increment the likes count
        wordStatistics.likes += 1;
        await wordStatistics.save();

        res.status(200).json({ message: 'Word liked successfully', likes: wordStatistics.likes });
    } catch (error) {
        console.error('Error liking word:', error);
        res.status(500).json({ error: 'Failed to like the word' });
    }
};


exports.dislikeWord = async (req, res) => {
    try {
        const { wordId } = req.params;
        const ipAddress = getIpAddress(req);

        // Check if the user has already disliked the word
        const existingDislikeLog = await LikeDislikeLog.findOne({
            where: {
                wordId,
                ipAddress,
                action: 'dislike',
            }
        });

        if (existingDislikeLog) {
            // If already disliked, remove the dislike
            await existingDislikeLog.destroy();
            const wordStatistics = await WordStatistics.findOne({ where: { wordId } });
            wordStatistics.dislikes -= 1;
            await wordStatistics.save();

            return res.status(200).json({ message: 'Dislike removed successfully', dislikes: wordStatistics.dislikes });
        }

        // If the word was previously liked, remove the like
        const existingLikeLog = await LikeDislikeLog.findOne({
            where: {
                wordId,
                ipAddress,
                action: 'like',
            }
        });

        if (existingLikeLog) {
            await existingLikeLog.destroy();
            const wordStatistics = await WordStatistics.findOne({ where: { wordId } });
            wordStatistics.likes -= 1;
            await wordStatistics.save();
        }

        // Log the dislike action
        await LikeDislikeLog.create({ wordId, ipAddress, action: 'dislike' });

        // Increment the dislikes count
        const wordStatistics = await WordStatistics.findOne({ where: { wordId } });
        wordStatistics.dislikes += 1;
        await wordStatistics.save();

        res.status(200).json({ message: 'Word disliked successfully', dislikes: wordStatistics.dislikes });
    } catch (error) {
        console.error('Error disliking word:', error);
        res.status(500).json({ error: 'Failed to dislike the word' });
    }
};

exports.createWord = async (req, res) => {
    try {

        const { headword, mp3Base64, pronunciation, origin, meanings } = req.body;

        let mp3Url = null;
        try {
            // Handle MP3 file upload if provided
            if (mp3Base64) {
                console.log("TODO: Implement file upload")
            }
            else {
                console.log("No file provided")
            }

        }
        catch (error) {
            console.log("error: " + error)
        }

        // Create the word entry
        const word = await Word.create({
            headword,
            pronunciation,
            origin,
            userId: req.user.id, // Associate the word with the logged-in user
            status: 'pending', // Set initial status to pending
            mp3Url, // Set the MP3 URL if available
        });

        // Create associated statistics
        await WordStatistics.create({ wordId: word.id });

        // Handle meanings and their associated definitions
        if (meanings && Array.isArray(meanings)) {
            for (const meaning of meanings) {
                const createdMeaning = await Meaning.create({
                    partOfSpeech: meaning.partOfSpeech,
                    wordId: word.id,
                });

                if (meaning.definitions && Array.isArray(meaning.definitions)) {
                    const definitions = meaning.definitions.map(def => ({
                        ...def,
                        meaningId: createdMeaning.id,
                    }));
                    definitions[0].synonyms = definitions[0].synonyms.split(',')
                    definitions[0].antonyms = definitions[0].antonyms.split(',')

                    await Definition.bulkCreate(definitions);
                }
            }
        }

        res.status(201).json({ message: 'Word created successfully', word });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create word' });
    }
};

exports.updateWord = async (req, res) => {
    try {
        const word = await Word.findByPk(req.params.id);
        if (word) {
            await word.update(req.body);

            // Update meanings if provided
            if (req.body.meanings) {
                // First, clear existing meanings
                await Meaning.destroy({ where: { wordId: word.id } });

                // Add updated meanings
                const meanings = req.body.meanings.map(meaning => ({
                    ...meaning,
                    wordId: word.id
                }));
                await Meaning.bulkCreate(meanings);
            }

            res.json(word);
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update word' });
    }
};

exports.deleteWord = async (req, res) => {
    try {
        const word = await Word.findByPk(req.params.id);
        if (word) {
            // Optionally, delete associated meanings and statistics
            await Meaning.destroy({ where: { wordId: word.id } });
            await WordStatistics.destroy({ where: { wordId: word.id } });

            await word.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete word' });
    }
};
