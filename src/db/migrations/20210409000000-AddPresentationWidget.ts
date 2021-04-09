import { QueryInterface } from "sequelize";

export const up = (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert("dimension_widgets", [
            {
                type: "presentation",
                name: "Presentation (Proof of concept)",
                isEnabled: true,
                isPublic: true,
                avatarUrl: "/img/avatars/googledocs.png",
                description: "Show a shared file as a presentation",
                optionsJson: '{}',
            }
        ]);
    }

export const down = (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("dimension_widgets");
}