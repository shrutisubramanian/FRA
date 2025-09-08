from flask import Flask, render_template, request, jsonify, send_file
import os
import json
from datetime import datetime
from pathlib import Path
import sqlite3
import pandas as pd

# Import your FRA processor
try:
    from fra_parser_enhanced import FRAProcessor, config
    PROCESSOR_AVAILABLE = True
except ImportError:
    PROCESSOR_AVAILABLE = False

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and processing"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'})
    
    if not PROCESSOR_AVAILABLE:
        return jsonify({'success': False, 'error': 'FRA Processor not available'})
    
    try:
        # Save uploaded file
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the file
        processor = FRAProcessor()
        result = processor.process_single_form(filepath)
        
        # Cleanup uploaded file
        os.remove(filepath)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/records')
@app.route('/api/records')
def get_records():
    try:
        if not config.db_file.exists():
            return jsonify([])

        conn = sqlite3.connect(config.db_file)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Claimant_EN, Village_EN, District_EN, OCR_Confidence, created_at 
            FROM fra_claims 
            ORDER BY created_at DESC LIMIT 50
        """)
        columns = [description[0] for description in cursor.description]
        records = cursor.fetchall()
        conn.close()

        result = [dict(zip(columns, record)) for record in records]

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/api/stats')
@app.route('/api/stats')
@app.route('/api/stats')
def get_stats():
    try:
        if not config.db_file.exists():
            return jsonify({
                'total_records': 0,
                'avg_confidence': 0,
                'unique_districts': 0,
                'district_distribution': {},
                'processor_available': PROCESSOR_AVAILABLE
            })

        conn = sqlite3.connect(config.db_file)
        df = pd.read_sql_query("SELECT * FROM fra_claims", conn)
        conn.close()

        # Ensure correct column types
        if 'OCR_Confidence' in df.columns:
            df['OCR_Confidence'] = pd.to_numeric(df['OCR_Confidence'], errors='coerce')

        district_distribution = df['District_EN'].value_counts().to_dict() if 'District_EN' in df.columns else {}

        stats = {
            'total_records': len(df),
            'avg_confidence': round(df['OCR_Confidence'].mean(), 2) if 'OCR_Confidence' in df.columns else 0,
            'unique_districts': df['District_EN'].nunique() if 'District_EN' in df.columns else 0,
            'district_distribution': district_distribution,
            'processor_available': PROCESSOR_AVAILABLE
        }

        return jsonify(stats)

    except Exception as e:
        return jsonify({'error': str(e)})

    except Exception as e:
        return jsonify({'error': str(e)})

    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)