class BoyMor{
    constructor(needle){
        this.needle = needle;
        this.charTable = this.makeCharTable(needle);
        this.offsetTable = this.makeOffsetTable(needle);
    }
    bmIndexOf(haystack) {
        var needle = this.needle;
        if (needle.length == 0) {
            return 0;
        }
        for (var i = needle.length - 1, j; i < haystack.length;) {
            for (j = needle.length - 1; needle.charAt(j) == haystack.charAt(i); --i, --j) {
                if (j == 0) {
                    return i;
                }
            }
            // i += needle.length - j; // For naive method
            i += Math.max(offsetTable[needle.length - 1 - j], charTable[haystack.charAt(i)]);
        }
        return -1;
    }
    
    /**
     * Makes the jump table based on the mismatched character information.
     */
    makeCharTable(needle) {
        var table = [];
        var length = 65535;
        for (var i = 0; i < length; ++i) {
            table.push(needle.length);
        }
        for (var i = 0; i < needle.length - 1; ++i) {
            //if(needle.charAt(i) < length){
                table[needle.charAt(i)] = needle.length - 1 - i;
            //}
        }
        return table;
    }

    /**
     * Makes the jump table based on the scan offset which mismatch occurs.
     */
    makeOffsetTable(needle) {
        var table = [];
        var length = needle.length;

        for(var i = 0; i < length; i++){
            table.push(0);
        }
        var lastPrefixPosition = needle.length;
        for (var i = needle.length - 1; i >= 0; --i) {
            if (this.isPrefix(needle, i + 1)) {
                lastPrefixPosition = i + 1;
            }
            table[needle.length - 1 - i] = lastPrefixPosition - i + needle.length - 1;
        }
        for (var i = 0; i < needle.length - 1; ++i) {
            var slen = this.suffixLength(needle, i);
            table[slen] = needle.length - 1 - i + slen;
        }
        return table;
    }

    /**
     * Is needle[p:end] a prefix of needle?
     */
    isPrefix(needle, p) {
        for (var i = p, j = 0; i < needle.length; ++i, ++j) {
            if (needle.charAt(i) != needle.charAt(j)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the maximum length of the substring ends at p and is a suffix.
     */
    suffixLength(needle, p) {
        var len = 0;
        for (var i = p, j = needle.length - 1;
                 i >= 0 && needle.charAt(i) == needle.charAt(j); --i, --j) {
            len += 1;
        }
        return len;
    }
}
