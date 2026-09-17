Create table if not exists Destinations(
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    short_description TEXT NOT NULL,
    culture Integer NOT NULL,
    adventure Integer NOT NULL,
    nature Integer NOT NULL,
    beaches Integer NOT NULL,
    nightlife Integer NOT NULL,
    cuisine Integer NOT NULL,
    wellness Integer NOT NULL,
    urban Integer NOT NULL,
    seclusion Integer NOT NULL  
);