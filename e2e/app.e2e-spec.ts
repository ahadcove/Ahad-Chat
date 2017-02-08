import { AhadAngularChatPage } from './app.po';

describe('ahad-angular-chat App', function() {
  let page: AhadAngularChatPage;

  beforeEach(() => {
    page = new AhadAngularChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
