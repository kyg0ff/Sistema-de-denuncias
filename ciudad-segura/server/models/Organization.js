class Organization {
  constructor() {
    this.organizations = [
      { id: 1, name: "Municipalidad de Wanchaq", type: "Gobierno Local", color: "#4f46e5" },
      { id: 2, name: "Policía de Tránsito", type: "Seguridad", color: "#059669" },
      { id: 3, name: "Fiscalización Ambiental", type: "Salud/Ambiente", color: "#d97706" }
    ];
    
    this.authorities = [
      { id: 1, name: "Oficial Roberto Gómez", cargo: "Jefe de Tránsito", orgId: 2, status: "Activo" },
      { id: 2, name: "Inspector Luis Alva", cargo: "Supervisor de Vías", orgId: 1, status: "Activo" },
      { id: 3, name: "Ana Torres", cargo: "Agente de Campo", orgId: 2, status: "Vacaciones" }
    ];
  }

  // Organizaciones
  getAllOrgs() {
    return this.organizations;
  }

  getOrgById(id) {
    return this.organizations.find(org => org.id === id);
  }

  createOrg(orgData) {
    const newOrg = {
      id: this.organizations.length + 1,
      ...orgData
    };
    this.organizations.push(newOrg);
    return newOrg;
  }

  // Autoridades
  getAllAuthorities() {
    return this.authorities.map(auth => {
      const org = this.getOrgById(auth.orgId);
      return {
        ...auth,
        orgName: org ? org.name : 'Desconocido'
      };
    });
  }

  getAuthoritiesByOrg(orgId) {
    return this.authorities.filter(auth => auth.orgId === orgId);
  }

  createAuthority(authData) {
    const newAuthority = {
      id: this.authorities.length + 1,
      ...authData
    };
    this.authorities.push(newAuthority);
    return newAuthority;
  }

  updateAuthority(id, updates) {
    const index = this.authorities.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.authorities[index] = { ...this.authorities[index], ...updates };
    return this.authorities[index];
  }

  deleteAuthority(id) {
    const index = this.authorities.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.authorities.splice(index, 1);
    return true;
  }
}

module.exports = new Organization();