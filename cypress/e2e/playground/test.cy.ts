describe('toy spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200');
    cy.get('.fs-4').then((elements) => {
      console.log(elements.length);
    });

    cy.get('.fs-6').then((elements) => {
      console.log(elements.length);
    });

    cy.get('.fs-6').eq(0).should('have.text', 'Beijing');
  });
});
