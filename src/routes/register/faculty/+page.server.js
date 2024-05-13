import { runQuery } from "../../../lib/db/database";
export const actions = {
    create: async ({request}) => {
        const data = await request.formData();
        const password = data.get('password');
        const email = data.get('email');
        const name = data.get('name');
        const department = data.get('department');
        const password2 = data.get('password2');
        console.log(`Passwords do not match`);
        if (password !== password2) {
            return {
                status: 200,
                body: {
                    message: 'Passwords do not match'
                }
            };
        }
        console.log(`Faculty ${name} registered successfully`);

        try {
            await runQuery(
                `INSERT INTO faculty (name, email, password, department) VALUES (?, ?, ?, ?)`,
                [name, email, password, department]
            );
            console.log(`Faculty ${name} registered successfully`);
            return {
                status: 200,
                body: {
                    message: `Faculty ${name} registered successfully`
                }
            };
        } catch (e) {
            console.error(`Error registering faculty ${name}`, e);
            return {
                status: 500,
                body: {
                    message: `Error registering faculty ${name}`
                }
            };
        }
    }
}