
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
    console.log('Checking storage buckets...');
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    console.log('Existing buckets:', buckets.map(b => b.name));

    const bucketName = 'skin-analyses';
    const bucket = buckets.find(b => b.name === bucketName);

    if (!bucket) {
        console.log(`Creating bucket: ${bucketName}...`);
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });

        if (createError) {
            console.error('Error creating bucket:', createError);
        } else {
            console.log('Bucket created successfully!');
        }
    } else {
        console.log(`Bucket '${bucketName}' already exists.`);
    }
}

setupStorage();
