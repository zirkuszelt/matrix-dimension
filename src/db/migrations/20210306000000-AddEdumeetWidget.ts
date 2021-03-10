import { QueryInterface } from "sequelize";

export const up = (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert("dimension_widgets", [
                {
                    type: "edumeet",
                    name: "Edumeet Conference",
                    isEnabled: true,
                    isPublic: true,
                    avatarUrl: "/img/avatars/edumeet.svg",
                    description: "Hold a video conference with Edumeet",
                    optionsJson: '{"conferenceUrl":""}',
                    
                },
            ]);
    }

export const down = (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("dimension_widgets");
    }