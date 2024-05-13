import { runQuery } from "../../../lib/db/database";
export const actions = {
    create: async ({request}) => {
        const data = await request.formData();
        const password = data.get('password');
        const email = data.get('email');
        const name = data.get('name');
        const department = data.get('department');
        const password2 = data.get('password2');
        if (password !== password2) {
            console.log(`Passwords do not match`);
            return {
                status: 200,
                body: {
                    message: 'Passwords do not match'
                }
            };
        }
        console.log(`Student ${name} registered successfully`);
        try {
            await runQuery(
                `INSERT INTO students (name, email, password, department) VALUES (?, ?, ?, ?)`,
                [name, email, password, department]
            );
            console.log(`student ${name} registered successfully`);
            return {
                status: 200,
                body: {
                    message: `student ${name} registered successfully`
                }
            };
        } catch (e) {
            console.error(`Error registering student ${name}`, e);
            return {
                status: 500,
                body: {
                    message: `Error registering student ${name}`
                }
            };
        }
    }
}