import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassStrenghtComponent } from './pass-strenght.component';

describe('PassStrenghtComponent', () => {
  let component: PassStrenghtComponent;
  let fixture: ComponentFixture<PassStrenghtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassStrenghtComponent]
    });
    fixture = TestBed.createComponent(PassStrenghtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default strength values when no password is provided', () => {
    expect(component.strength.score).toBe(0);
    expect(component.strength.label).toBe('Enter password');
    expect(component.strength.color).toBe('#666666');
  });

  it('should evaluate a weak password correctly', () => {
    component.passwordToCheck = 'weak';
    component.ngOnChanges();
    expect(component.strength.score).toBe(1);
    expect(component.strength.label).toBe('Weak');
    expect(component.strength.color).toBe('#ff4444');
  });

  it('should evaluate a fair password correctly', () => {
    component.passwordToCheck = 'Password1';
    component.ngOnChanges();
    expect(component.strength.score).toBe(2);
    expect(component.strength.label).toBe('Fair');
    expect(component.strength.color).toBe('#ff8800');
  });

  it('should evaluate a good password correctly', () => {
    component.passwordToCheck = 'Password1234';
    component.ngOnChanges();
    expect(component.strength.score).toBe(3);
    expect(component.strength.label).toBe('Good');
    expect(component.strength.color).toBe('#ffbb00');
  });

  it('should evaluate an excellent password correctly', () => {
    component.passwordToCheck = 'SuperStrongP@ssword123';
    component.ngOnChanges();
    expect(component.strength.score).toBe(4);
    expect(component.strength.label).toBe('Excellent');
    expect(component.strength.color).toBe('#00cc44');
  });

  it('should update strength when password changes', () => {
    // Initial state
    expect(component.strength.score).toBe(0);

    // Update to weak password
    component.passwordToCheck = 'abc';
    component.ngOnChanges();
    expect(component.strength.score).toBe(1);

    // Update to stronger password
    component.passwordToCheck = 'Abc123!@#';
    component.ngOnChanges();
    expect(component.strength.score).toBe(3);

    // Back to no password
    component.passwordToCheck = '';
    component.ngOnChanges();
    expect(component.strength.score).toBe(0);
  });
  describe('password scoring system', () => {
    it('should consider length in password strength', () => {
      // Short password
      component.passwordToCheck = 'abc';
      component.ngOnChanges();
      const shortScore = component.strength.score;

      // Longer password
      component.passwordToCheck = 'abcdefghijklm';
      component.ngOnChanges();
      const longerScore = component.strength.score;

      expect(longerScore).toBeGreaterThan(shortScore);
    });

    it('should consider character variety in password strength', () => {
      // Test with different character combinations
      component.passwordToCheck = 'abcdefgh'; // only lowercase
      component.ngOnChanges();
      const lowercaseScore = component.strength.score;

      component.passwordToCheck = 'abcdEFGH'; // lowercase + uppercase
      component.ngOnChanges();
      const mixedCaseScore = component.strength.score;

      component.passwordToCheck = 'abcdEFGH123'; // lowercase + uppercase + numbers
      component.ngOnChanges();
      const withNumbersScore = component.strength.score;

      component.passwordToCheck = 'abcdEFGH123!@#'; // lowercase + uppercase + numbers + special
      component.ngOnChanges();
      const withSpecialCharsScore = component.strength.score;

      expect(withSpecialCharsScore).toBeGreaterThanOrEqual(withNumbersScore);
      expect(withNumbersScore).toBeGreaterThanOrEqual(mixedCaseScore);
      expect(mixedCaseScore).toBeGreaterThanOrEqual(lowercaseScore);
    });
  });
});
