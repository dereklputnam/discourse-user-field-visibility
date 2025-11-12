import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-field-visibility",

  initialize(container) {
    withPluginApi("0.8", (api) => {
      const currentUser = api.getCurrentUser();

      if (!currentUser) {
        return;
      }

      const rules = settings.field_visibility_rules;

      if (!rules || rules.length === 0) {
        return;
      }

      const userGroups = currentUser.groups || [];
      const userGroupNames = userGroups.map(g => g.name);

      const site = container.lookup("service:site");
      const userFields = site.get("user_fields");

      if (!userFields) {
        return;
      }

      rules.forEach((rule) => {
        const customField = userFields.find(
          (field) => field.name.toLowerCase() === rule.field_name.toLowerCase()
        );

        if (!customField) {
          return;
        }

        // Hide this field by default for everyone
        const fieldId = customField.id;
        const fieldName = customField.dasherized_name || customField.name.toLowerCase().replace(/\s+/g, '-');

        const style = document.createElement('style');
        style.id = `custom-field-visibility-${fieldId}`;
        style.innerHTML = `
          .public-user-field.${fieldName} { display: none !important; }
          .public-user-field.public-user-field__${fieldName} { display: none !important; }
          .user-card .public-user-field.${fieldName} { display: none !important; }
          .user-card .public-user-field__${fieldName} { display: none !important; }
          .user-field-${fieldId} { display: none !important; }
          .user-profile-fields .user-field-${fieldId} { display: none !important; }
          .public-user-fields .user-field-${fieldId} { display: none !important; }
          .collapsed-info .user-field[data-field-id="${fieldId}"] { display: none !important; }
        `;
        document.head.appendChild(style);

        // Check if user is in any of the allowed groups for this rule
        const allowedGroupsStr = rule.allowed_groups || "";
        const allowedGroups = allowedGroupsStr.split(',').map(g => g.trim()).filter(g => g.length > 0);
        const isInAllowedGroup = allowedGroups.some(group => userGroupNames.includes(group));

        if (isInAllowedGroup) {
          document.body.classList.add(`show-custom-field-${fieldId}`);
        }
      });
    });
  }
};
