beforeEach(() => {
  cy.visit('/');
});
describe('toy spec', () => {
  it('passes', () => {
    cy.title().should('eq', 'test title');
    cy.get('.fs-4').then((elements) => {
      console.log(elements.length);
    });

    cy.get('.fs-6').then((elements) => {
      console.log(elements.length);
    });

    cy.get('.fs-6').eq(0).should('have.text', 'Beijing');

    cy.get('.fs-6').click({ multiple: true });
  });

  it('test', () => {
    cy.get('.fs-6').eq(0).should('have.text', 'Beijing');
  });
});
