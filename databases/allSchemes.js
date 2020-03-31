import Realm from 'realm';
export const LOCATIONS_SCHEMA = "Locations";

export const LocationsSchema ={
    name:LOCATIONS_SCHEMA,
    primaryKey:'id',
    properties:{
        id:'int',
        latitude:'double',
        longitude:'double',
        creationDate:'date',

    }
};

const databaseOptions = {
    path:'locations.realm',
    schema:[LocationsSchema],
    schemaVersion:0,
};

export const insertNewLocations = newLocations =>new Promise((resolve,reject)=>{
Realm.open(databaseOptions)
    .then(realm=>{
        realm.write(()=>{
            realm.create(LOCATIONS_SCHEMA,newLocations);
            resolve(newLocations);
        })
    })
    .catch((error)=>{
        reject(error);
    });
});

export const queryAllLocations = () =>new Promise((resolve,reject)=>{
    Realm.open(databaseOptions)
        .then(realm=>{
           let allLocations = realm.objects(LOCATIONS_SCHEMA);
           resolve(allLocations);
        })
        .catch((error)=>{
                reject(error);
            }
            );
});

export const deleteAllLocations = () =>new Promise((resolve,reject)=>{
    Realm.open(databaseOptions)
        .then(realm=>{
            realm.write(()=>
                {
                    let allLocations= realm.objects(LOCATIONS_SCHEMA)
                    realm.delete(allLocations)
                }
            )
        })
        .catch((error)=>{
            reject(error);
        });

});


