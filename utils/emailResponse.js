function replacePlaceholders(template, values) {
    return template.replace(/{(.*?)}/g, (match, key) => values[key] || match);
  }

  export{replacePlaceholders}