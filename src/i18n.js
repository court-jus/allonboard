var i18n = null;

if (typeof(LANGUAGE)!=undefined && LANGUAGE == 'FR')
    {
    i18n = {
        'Human': 'Humain',
        'Robot': 'Robot',
        };
    }

function _(s)
    {
    if (typeof(i18n)!=undefined && i18n[s])
        {
        return i18n[s];
        }
    return s;
    }
