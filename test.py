from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_home_route(self):
        """Test to make sure the homepage works"""
        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
           
    def test_valid_word(self):
        """Test the session"""
        with self.client as client:
            with self.client.session_transaction() as session:
                session['board'] = [['R', 'B', 'X', 'S', 'H', 'M'],
                                    ['Y', 'I', 'M', 'Y', 'U', 'G'],
                                    ['V', 'I', 'H', 'N', 'O', 'O'],
                                    ['U', 'T', 'A', 'R', 'F', 'T'],
                                    ['W', 'X', 'B', 'Y', 'R', 'R'],
                                    ['I', 'B', 'F', 'S', 'U', 'N']]
            response = self.client.get('/check_word?word=sun')
            self.assertEqual(response.json['result'], 'ok')
                       
            
    def test_make_board(self):
        """Test whether the correct board size is being made"""
        with self.client:
            response = self.client.get('/make-board?boardSize=6')
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertIn('result', data)
            self.assertIsInstance(data['result'], list)
            self.assertEqual(len(data['result']), 6)
           
