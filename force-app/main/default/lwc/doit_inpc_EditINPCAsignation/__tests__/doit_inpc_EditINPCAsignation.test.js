import { createElement } from 'lwc';
import Doit_inpc_EditINPCAsignation from 'c/doit_inpc_EditINPCAsignation';

describe('c-doit-inpc-edit-inpc-asignation', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: test case generated by CLI command, please fill in test logic', () => {
        // Arrange
        const element = createElement('c-doit-inpc-edit-inpc-asignation', {
            is: Doit_inpc_EditINPCAsignation
        });

        // Act
        document.body.appendChild(element);

        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(1).toBe(1);
    });
});