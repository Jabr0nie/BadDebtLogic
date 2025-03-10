pragma solidity ^0.8.0;

contract BibleOnChain {
    // Mapping: Book ID -> Chapter ID -> Verse ID -> Text
    mapping(uint8 => mapping(uint16 => mapping(uint16 => string))) public verses;
    
    // Book names for reference (optional)
    string[] public bookNames;
    
    // Event for tracking updates
    event VerseAdded(uint8 bookId, uint16 chapterId, uint16 verseId, string text);
    
    constructor() {
        // Initialize book names
        bookNames.push("Genesis");
        bookNames.push("Exodus");
        // Add all 66 books or load dynamically
    }

    // Add or update a verse
    function setVerse(
        uint8 bookId,    // 0-65 for 66 books
        uint16 chapterId, // 1-150
        uint16 verseId,   // 1-176
        string memory text
    ) public {
        verses[bookId][chapterId][verseId] = text;
        emit VerseAdded(bookId, chapterId, verseId, text);
    }

    // Retrieve a verse
    function getVerse(
        uint8 bookId,
        uint16 chapterId,
        uint16 verseId
    ) public view returns (string memory) {
        return verses[bookId][chapterId][verseId];
    }

    // Batch upload verses
    function batchSetVerses(
        uint8[] memory bookIds,
        uint16[] memory chapterIds,
        uint16[] memory verseIds,
        string[] memory texts
    ) public {
        require(bookIds.length == chapterIds.length && chapterIds.length == verseIds.length && verseIds.length == texts.length, "Array length mismatch");
        for (uint i = 0; i < bookIds.length; i++) {
            verses[bookIds[i]][chapterIds[i]][verseIds[i]] = texts[i];
            emit VerseAdded(bookIds[i], chapterIds[i], verseIds[i], texts[i]);
        }
    }
}