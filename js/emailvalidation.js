/**
 * Enhanced Email Validation System
 * Includes RFC-compliant regex, MX record checking, and disposable email detection
 */

/**
 * RFC 5322 compliant email regex pattern
 * This is a comprehensive regex that follows the email specification
 */
const RFC_5322_EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

/**
 * Disposable email provider blacklist
 * Common temporary/disposable email services
 */
const DISPOSABLE_EMAIL_DOMAINS = [
    '10minutemail.com', '20minutemail.com', '33mail.com', '4warding.com',
    '4warding.net', '4warding.org', '60minutemail.com', 'airpost.net',
    'amilegit.com', 'anonmails.de', 'antispam.de', 'binkmail.com',
    'bobmail.info', 'bofthew.com', 'brefmail.com', 'bsnow.net',
    'bugmenot.com', 'bumpymail.com', 'casualdx.com', 'chammy.info',
    'devnullmail.com', 'dispostable.com', 'dodgeit.com', 'dodgit.com',
    'dodgit.org', 'doiea.com', 'dontreg.com', 'dontsendmespam.de',
    'e4ward.com', 'email60.com', 'emailias.com', 'emailinfive.com',
    'emailmiser.com', 'emailtemporar.ro', 'emailwarden.com', 'evopo.com',
    'fakeinbox.com', 'fakeinformation.com', 'fakemail.fr', 'fakemailgenerator.com',
    'fastmazda.com', 'filzmail.com', 'frapmail.com', 'fudgerub.com',
    'getairmail.com', 'getmails.eu', 'getonemail.com', 'ghosttexter.de',
    'giantmail.de', 'guerrillamail.com', 'guerrillamailblock.com',
    'h8s.org', 'haltospam.com', 'hiddentragedy.com', 'hidemail.de',
    'hmamail.com', 'hochsitze.com', 'hotpop.com', 'hulapla.de',
    'ieatspam.eu', 'ieh-mail.de', 'imails.info', 'inboxclean.com',
    'inboxclean.org', 'incognitomail.org', 'insorg-mail.info', 'ipoo.org',
    'irish2me.com', 'jetable.com', 'jetable.net', 'jetable.org',
    'jnxjn.com', 'junk1e.com', 'kasmail.com', 'kaspop.com',
    'keepmymail.com', 'killmail.com', 'killmail.net', 'klassmaster.com',
    'klzlk.com', 'koszmail.pl', 'kurzepost.de', 'lifebyfood.com',
    'link2mail.net', 'litedrop.com', 'lol.ovpn.to', 'lookugly.com',
    'lopl.co.cc', 'lortemail.dk', 'lovemeleaveme.com', 'lr78.com',
    'm4ilweb.info', 'mail-temp.com', 'mail.by', 'mail4trash.com',
    'mailbidon.com', 'mailcatch.com', 'mailde.de', 'maildrop.cc',
    'maileater.com', 'mailexpire.com', 'mailfreeonline.com', 'mailguard.me',
    'mailin8r.com', 'mailinater.com', 'mailinator.com', 'mailinator2.com',
    'mailincubator.com', 'mailme.lv', 'mailmetrash.com', 'mailmoat.com',
    'mailnull.com', 'mailpick.biz', 'mailsac.com', 'mailscrap.com',
    'mailshell.com', 'mailsiphon.com', 'mailtemp.info', 'mailtome.de',
    'mailtothis.com', 'mailzi.ru', 'meltmail.com', 'messagebeamer.de',
    'mintemail.com', 'moburl.com', 'monemail.fr', 'monumentmail.com',
    'mt2014.com', 'mycleaninbox.net', 'mymail-in.net', 'myspamless.com',
    'mytrashmail.com', 'neomailbox.com', 'nepwk.com', 'nervmich.net',
    'nervtmich.net', 'netmails.net', 'netzidiot.de', 'neverbox.com',
    'no-spam.ws', 'nobulk.com', 'noclickemail.com', 'nogmailspam.info',
    'nomail2me.com', 'nomail.cf', 'nomail.pw', 'nomorespamemails.com',
    'nospam.ze.tc', 'nospamfor.us', 'nospamthanks.info', 'nowmymail.com',
    'objectmail.com', 'obobbo.com', 'onewaymail.com', 'online.ms',
    'opayq.com', 'ordinaryamerican.net', 'otherinbox.com', 'owlpic.com',
    'pancakemail.com', 'pimpedupmyspace.com', 'pjkh.com', 'politikerclub.de',
    'poofy.org', 'pookmail.com', 'privacy.net', 'proxymail.eu',
    'punkass.com', 'putthisinyourspamdatabase.com', 'quickinbox.com',
    'rcpt.at', 'recode.me', 'recursor.net', 'regbypass.com',
    'rejectmail.com', 'rklips.com', 'rmqkr.net', 'rppkn.com',
    'rtrtr.com', 's0ny.net', 'safe-mail.net', 'safetymail.info',
    'safetypost.de', 'sandelf.de', 'saynotospams.com', 'selfdestructingmail.com',
    'sendspamhere.com', 'sharklasers.com', 'shieldemail.com', 'shiftmail.com',
    'shitmail.me', 'shortmail.net', 'sibmail.com', 'sinnlos-mail.de',
    'slapsfromlastnight.com', 'slaskpost.se', 'smashmail.de', 'smellfear.com',
    'snakemail.com', 'sneakemail.com', 'snkmail.com', 'sofimail.com',
    'sofort-mail.de', 'sogetthis.com', 'soodonims.com', 'spam.la',
    'spam4.me', 'spamail.de', 'spambob.com', 'spambob.net',
    'spambob.org', 'spambog.com', 'spambog.de', 'spambog.ru',
    'spambox.info', 'spambox.us', 'spamday.com', 'spamex.com',
    'spamfree24.com', 'spamfree24.de', 'spamfree24.org', 'spamgourmet.com',
    'spamherelots.com', 'spamhereplease.com', 'spamhole.com', 'spamify.com',
    'spaminator.de', 'spamkill.info', 'spaml.com', 'spaml.de',
    'spamlot.net', 'spammotel.com', 'spamobox.com', 'spamoff.de',
    'spamslicer.com', 'spamtraps.com', 'spamwc.de', 'speed.1s.fr',
    'stuffmail.de', 'super-auswahl.de', 'supergreatmail.com', 'supermailer.jp',
    'superrito.com', 'tagyourself.com', 'teewars.org', 'teleosaurs.xyz',
    'teleworm.com', 'temp-mail.org', 'tempail.com', 'tempe-mail.com',
    'tempemail.com', 'tempinbox.co.uk', 'tempinbox.com', 'tempmail.eu',
    'tempmail.it', 'tempmail2.com', 'tempmailer.com', 'tempmailer.de',
    'tempthe.net', 'thankyou2010.com', 'thisisnotmyrealemail.com',
    'throwawayemailaddress.com', 'tilien.com', 'tmail.ws', 'tmailinator.com',
    'toiea.com', 'tradermail.info', 'trash-amil.com', 'trash-mail.at',
    'trash-mail.com', 'trash-mail.de', 'trash2009.com', 'trashemail.de',
    'trashmail.at', 'trashmail.com', 'trashmail.de', 'trashmail.me',
    'trashmail.net', 'trashmail.org', 'trashymail.com', 'trialmail.de',
    'turual.com', 'twinmail.de', 'tyldd.com', 'uggsrock.com',
    'umail.net', 'upliftnow.com', 'uplipht.com', 'uroid.com',
    'us.af', 'venompen.com', 'veryrealemail.com', 'viditag.com',
    'viewcastmedia.com', 'viewcastmedia.net', 'viewcastmedia.org',
    'webemail.me', 'webm4il.info', 'wh4f.org', 'whyspam.me',
    'willselfdestruct.com', 'winemaven.info', 'wronghead.com', 'wuzup.net',
    'wuzupmail.net', 'xagloo.com', 'xemaps.com', 'xents.com',
    'xmaily.com', 'xoxy.net', 'yapped.net', 'yeah.net',
    'yep.it', 'yogamaven.com', 'yopmail.com', 'yopmail.fr',
    'yopmail.net', 'youmailr.com', 'ypmail.webnast.de', 'zippymail.info',
    'zoemail.org', 'zomg.info', 'zoemail.net'
];

/**
 * Validate email format using RFC 5322 compliant regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
function isValidEmailFormat(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    return RFC_5322_EMAIL_REGEX.test(email.trim());
}

/**
 * Check if email domain is in disposable email blacklist
 * @param {string} email - Email to check
 * @returns {boolean} - True if email is from disposable provider
 */
function isDisposableEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    const domain = email.toLowerCase().split('@')[1];
    if (!domain) {
        return false;
    }
    
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Check MX records for email domain
 * Uses a public DNS-over-HTTPS API to check if domain has valid MX records
 * @param {string} email - Email to check
 * @returns {Promise<{valid: boolean, message: string}>} - MX record check result
 */
async function checkMXRecords(email) {
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Invalid email format' };
    }
    
    const domain = email.toLowerCase().split('@')[1];
    if (!domain) {
        return { valid: false, message: 'Invalid email format' };
    }
    
    try {
        // Use Cloudflare's DNS-over-HTTPS API to check MX records
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
            headers: {
                'Accept': 'application/dns-json'
            }
        });
        
        if (!response.ok) {
            return { valid: true, message: 'Could not verify MX records (network error)' };
        }
        
        const data = await response.json();
        
        // Check if MX records exist
        if (data.Answer && data.Answer.length > 0) {
            return { valid: true, message: 'Valid email domain' };
        } else {
            // Check for A records as fallback (some domains use A records instead of MX)
            const aRecordResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
                headers: {
                    'Accept': 'application/dns-json'
                }
            });
            
            if (aRecordResponse.ok) {
                const aData = await aRecordResponse.json();
                if (aData.Answer && aData.Answer.length > 0) {
                    return { valid: true, message: 'Valid email domain' };
                }
            }
            
            return { valid: false, message: 'Domain does not have valid mail servers' };
        }
    } catch (error) {
        // Network error or API failure - don't block registration but show warning
        console.warn('MX record check failed:', error);
        return { valid: true, message: 'Could not verify domain (checking...)' };
    }
}

/**
 * Comprehensive email validation
 * @param {string} email - Email to validate
 * @returns {Promise<{valid: boolean, status: string, message: string}>} - Validation result
 */
async function validateEmail(email) {
    // Step 1: Format validation
    if (!isValidEmailFormat(email)) {
        return {
            valid: false,
            status: 'invalid',
            message: 'Invalid email format'
        };
    }
    
    // Step 2: Disposable email check
    if (isDisposableEmail(email)) {
        return {
            valid: false,
            status: 'suspicious',
            message: 'Disposable/temporary email addresses are not allowed'
        };
    }
    
    // Step 3: MX record check (async)
    const mxCheck = await checkMXRecords(email);
    
    if (!mxCheck.valid) {
        return {
            valid: false,
            status: 'suspicious',
            message: mxCheck.message
        };
    }
    
    return {
        valid: true,
        status: 'valid',
        message: 'Valid email address'
    };
}

/**
 * Real-time email validation with visual feedback
 * @param {string} email - Email to validate
 * @param {HTMLElement} inputElement - Input element to update
 * @param {HTMLElement} errorElement - Error message element
 * @returns {Promise<void>}
 */
async function validateEmailWithFeedback(email, inputElement, errorElement) {
    // Clear previous feedback
    inputElement.classList.remove('email-valid', 'email-invalid', 'email-suspicious');
    errorElement.textContent = '';
    
    if (!email || email.trim() === '') {
        return;
    }
    
    // Show loading state
    inputElement.classList.add('email-checking');
    errorElement.textContent = 'Checking email...';
    
    try {
        const result = await validateEmail(email);
        
        // Remove loading state
        inputElement.classList.remove('email-checking');
        
        // Apply appropriate class and message
        if (result.valid) {
            inputElement.classList.add('email-valid');
            errorElement.textContent = '';
            errorElement.classList.remove('error-message');
            errorElement.classList.add('success-message');
        } else {
            if (result.status === 'suspicious') {
                inputElement.classList.add('email-suspicious');
            } else {
                inputElement.classList.add('email-invalid');
            }
            errorElement.textContent = result.message;
            errorElement.classList.remove('success-message');
            errorElement.classList.add('error-message');
        }
    } catch (error) {
        // Remove loading state on error
        inputElement.classList.remove('email-checking');
        console.error('Email validation error:', error);
    }
}

