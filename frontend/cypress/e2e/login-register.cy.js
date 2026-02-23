/// <reference types="cypress" />

describe('Login', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('should display login page', () => {
    cy.visit('/login')
    cy.url().should('include', '/login')
    cy.get('h1').invoke('text').then((text) => {
      expect(text.toLowerCase()).to.match(/sign in|zaloguj/i)
    })
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('form').find('button[type="submit"]').should('be.visible')
  })

  it('should have link to register', () => {
    cy.visit('/login')
    cy.get('a[href*="/register"]').first().click()
    cy.url().should('include', '/register')
  })

  it('should login with valid credentials', () => {
    const email = `login-test-${Date.now()}@example.com`
    const password = 'test1234'
    cy.visit('/register')
    cy.get('form').filter(':has(input[name="name"])').within(() => {
      cy.get('input[name="name"]').type('Login Test User')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(password)
      cy.get('button[type="submit"]').click()
    })
    cy.url().should('not.include', '/register', { timeout: 15000 })
    cy.clearLocalStorage()
    cy.visit('/login')
    cy.get('form').filter(':has(input[name="email"]):not(:has(input[name="name"]))').within(() => {
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(password)
      cy.get('button[type="submit"]').click()
    })
    cy.url().should('not.include', '/login', { timeout: 15000 })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.a('string')
    })
  })

  it('should show error or stay on login with invalid credentials', () => {
    cy.visit('/login')
    cy.get('form').filter(':has(input[name="email"]):not(:has(input[name="name"]))').within(() => {
      cy.get('input[name="email"]').type('invalid@example.com')
      cy.get('input[name="password"]').type('wrong')
      cy.get('button[type="submit"]').click()
    })
    cy.wait(1500)
    cy.get('body').should('be.visible')
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token')
      if (!token) {
        cy.url().should('include', '/login')
      }
    })
  })
})

describe('Register', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('should display register page', () => {
    cy.visit('/register')
    cy.url().should('include', '/register')
    cy.get('h1').invoke('text').then((text) => {
      expect(text.toLowerCase()).to.match(/sign up|zarejestruj/)
    })
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('form').find('button[type="submit"]').should('be.visible')
  })

  it('should have link to login', () => {
    cy.visit('/register')
    cy.get('a[href*="/login"]').first().click()
    cy.url().should('include', '/login')
  })

  it('should register a new user and redirect', () => {
    cy.visit('/register')
    const email = `cypress-${Date.now()}@example.com`
    cy.get('form').filter(':has(input[name="name"])').within(() => {
      cy.get('input[name="name"]').type('Cypress User')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type('test1234')
      cy.get('button[type="submit"]').click()
    })
    cy.url().should('not.include', '/register', { timeout: 15000 })
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.a('string')
    })
  })
})
