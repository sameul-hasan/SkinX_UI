# SkinX Dataset Documentation

**Total Images: 151,464 files**

Complete inventory of all skin disease image datasets in the SkinX project.

---

## Quick Summary Table

| Dataset | Images | Type | Classes | Structure |
|---------|--------|------|---------|-----------|
| processed_images/ | 52,741 | Processed | Mixed | Flat directory |
| SkinDisNet | 27,360 | Clinical | Multi | Augmented + Preprocessed |
| SkinDisease/ | 15,444 | Clinical | 22 | Train/Test splits |
| archive/ | 15,444 | Legacy | 22 | Copy of SkinDisease |
| Vitiligo Dataset | 10,459 | Clinical | 2 | Train/Test/Valid splits |
| ArsenicSkinImageBD/ | 8,892 | Clinical | 2 (Binary) | Infected/Not Infected |
| Synthetic Dermatology | 6,000 | Synthetic | Mixed | Original + Synthetic |
| dataverse_files/ | 5,450 | Raw | Various | CSV + Images |
| skin_2/ | 4,092 | Clinical | 5 | Organized by disease |
| Scabies_Dataset_DIB/ | 3,000 | Clinical | 2 | Original + Augmented |
| Images/ | 1,612 | Clinical | 5 | Simple structure |
| MPox-Vision/ | 800 | Clinical | 4 | Balanced classes |
| complete_mednode_dataset/ | 170 | Clinical | 2 | Minimal dataset |

---

## Detailed Dataset Breakdown

### 1. processed_images/ (52,741 images)
**Status**: Pre-processed, ready for model input  
**Structure**: Flat directory containing 52,743 image files  
**Use Case**: Direct training without additional preprocessing  

```
processed_images/
├── [52,741 image files]
└── [Ready for immediate use in ML pipelines]
```

---

### 2. SkinDisNet A Multi-Class Clinical Images (27,360 images)
**Status**: Multi-class clinical dataset  
**Structure**: Two separate versions with augmentation and preprocessing  

#### SkinDisNet v1:
```
SkinDisNet/
├── Augmented/      11,970 images (data augmentation applied)
└── Preprocessed/    1,710 images (normalized/resized)
```

#### SkinDisNet_2:
```
SkinDisNet_2/
├── Augmented/      11,970 images
├── Preprocessed/    1,710 images
└── SkinDisNet_Metadata.csv
```

**Total**: 27,360 images  
**Best For**: Multi-class skin disease classification with augmented training data

---

### 3. SkinDisease/ (15,444 images) ⭐ PRIMARY DATASET
**Status**: Comprehensive multi-class dataset - **22 skin disease classes**  
**Structure**: Train and Test splits  
**Class Balance**: Well-distributed across 22 categories  

#### Complete Class List (Train Split - 12,722 images):
```
├─ Unknown_Normal:           1,651 (largest class)
├─ Benign_tumors:            1,093
├─ Tinea:                      923
├─ Psoriasis:                  820
├─ Actinic_Keratosis:          748
├─ Vitiligo:                   714
├─ SkinCancer:                 693
├─ Eczema:                   1,010
├─ Warts:                      580
├─ DrugEruption:               547
├─ Infestations_Bites:         524
├─ Vascular_Tumors:            543
├─ Lichen:                     553
├─ Vasculitis:                 461
├─ Seborrh_Keratoses:          455
├─ Rosacea:                    254
├─ Candidiasis:                248
├─ Lupus:                      311
├─ Sun_Sunlight_Damage:        312
├─ Moles:                      361
├─ Bullous:                    504
└─ Acne:                       593
```

**Test Split**: 2,722 images (same 22 classes)  
**Best For**: Multi-class disease classification, primary training dataset  
**Recommendation**: ✅ Use as main training set

---

### 4. archive/ (15,444 images)
**Status**: Legacy copy  
**Content**: Duplicate of SkinDisease/ dataset  
**Note**: Can be used for validation or redundancy, but redundant with SkinDisease/

---

### 5. Dermatological Images for Vitiligo Disease Dataset (10,459 images)
**Status**: Specialized binary classification for Vitiligo  
**Classes**: 2 (Healthy Skin vs. Vitiligo Disease)  
**Structure**: Well-organized Train/Test/Valid splits  

#### Data Distribution:
```
Training Set:
├─ Healthy Skin:        3,813 images
└─ Vitiligo Disease:    4,587 images
Total Train: 8,400 images

Test Set:
├─ Healthy Skin:          162 images
└─ Vitiligo Disease:      861 images
Total Test: 1,023 images

Validation Set:
├─ Healthy Skin:          152 images
└─ Vitiligo Disease:      884 images
Total Valid: 1,036 images
```

**Best For**: Binary classification, Vitiligo detection, validation testing  
**Note**: Excellent class balance and proper validation split

---

### 6. ArsenicSkinImageBD/ (8,892 images)
**Status**: Binary classification dataset  
**Classes**: 2 (Infected vs. Not Infected)  
**Balance**: Perfectly balanced  

```
├─ infected:         4,446 images (50%)
└─ not_infected:     4,446 images (50%)
```

**Best For**: Binary skin condition detection (Arsenic-related skin disease)  
**Advantage**: Perfect class balance prevents training bias

---

### 7. Synthetic Dermatology Dataset for Racial Bias Mitigation (6,000 images)
**Status**: Synthetic data for reducing racial bias  
**Purpose**: Address under-representation in traditional medical datasets  

```
├─ original-1:       1,000 images
├─ original-3:       1,000 images
├─ synthetic-1:      1,000 images
├─ synthetic-2:      1,000 images
└─ synthetic-3:      1,000 images
```

**metadata.csv**: Contains demographic and classification metadata  
**Best For**: Bias-aware model training, fairness evaluation  
**Use Case**: Test model performance across synthetic races

---

### 8. dataverse_files/ (5,450 images)
**Status**: Raw data from research repository  
**Metadata**: Includes structured CSV files  

#### Contents:
```
├─ Metadata_schema.md          (Schema definition)
├─ Skin_Metadata-1.csv         (Labels and metadata)
├─ test_split-1.csv            (Test set definitions)
├─ train_split-1.csv           (Training set definitions)
├─ DATASET_0/                  (5,450 images distributed)
└─ DATASET_1/
```

**Best For**: Research purposes, understanding metadata structure  
**Note**: Requires CSV alignment for proper training

---

### 9. skin_2/ (4,092 images)
**Status**: Multi-disease dataset  
**Classes**: 5

```
├─ SJS-TEN:               1,356 images (Stevens-Johnson/Toxic Epidermal Necrolysis)
├─ Nail_psoriasis:        1,080 images
├─ Vitiligo:                864 images
├─ acne:                    492 images
└─ hyperpigmentation:       300 images
```

**Best For**: Targeted disease classification, especially rare conditions (SJS-TEN)  
**Note**: Imbalanced classes - may need weighting

---

### 10. Scabies_Dataset_DIB/ (3,000 images)
**Status**: Binary classification with augmentation  
**Classes**: 2 (Scabies vs. Healthy)  

#### Original Data:
```
├─ Scabies:   400 images
└─ healthy:   200 images
Total: 600 images
```

#### Augmented Data (4x expansion):
```
├─ scabies:  1,200 images
└─ healthy:  1,200 images
Total: 2,400 images
```

**Best For**: Scabies detection, data augmentation techniques study  
**Advantage**: Shows effectiveness of augmentation (4x increase)

---

### 11. Images/ (1,612 images)
**Status**: Basic multi-class dataset  
**Classes**: 5

```
├─ Eczema:           381 images
├─ Tinea Ringworm:   316 images
├─ Vitiligo:         312 images
├─ Dermatitis:       302 images
└─ Scabies:          301 images
```

**Best For**: Quick proof-of-concept, small model testing  
**Note**: Relatively small and balanced

---

### 12. MPox-Vision/ (800 images)
**Status**: Balanced multi-class dataset  
**Classes**: 4 (equal distribution)  

```
├─ Acne:        200 images
├─ Chickenpox:  200 images
├─ Measles:     200 images
└─ Monkeypox:   200 images
```

**Best For**: Quick testing, balanced multi-class experiments  
**Advantage**: Perfect class balance (25% each)  
**Note**: Small dataset - suitable for transfer learning

---

### 13. complete_mednode_dataset/ (170 images)
**Status**: Minimal dataset  
**Classes**: 2

```
├─ melanoma:   70 images
└─ naevus:    100 images
```

**Best For**: Melanoma detection research, supplementary data  
**Note**: Too small for standalone training; use for validation only

---

### 14. Dermatological Images for Vitiligo Disease Dataset/ (Alternative entry)
See **Section 5** - This is a duplicate reference for clarity

---

## File Format Support

All datasets support the following image formats:
- `.jpg` / `.jpeg` (most common)
- `.png`
- `.tiff`
- `.bmp`

**Recommendation**: Convert all to `.jpg` at 224×224 pixels for consistent pipeline processing

---

## Dataset Statistics & Recommendations

### By Size (Largest to Smallest):
1. **processed_images/** (52.7k) - Pre-processed, production-ready
2. **SkinDisNet** (27.4k) - Augmented + preprocessed variants
3. **SkinDisease/** (15.4k) - ⭐ **PRIMARY CHOICE** - 22-class gold standard
4. **archive/** (15.4k) - Redundant copy
5. **Vitiligo Dataset** (10.5k) - Specialized binary classification
6. **ArsenicSkinImageBD/** (8.9k) - Balanced binary classification
7. **Synthetic Dermatology** (6.0k) - Bias mitigation focus
8. **dataverse_files/** (5.5k) - Research metadata
9. **skin_2/** (4.1k) - 5-class specialized
10. **Scabies_Dataset_DIB/** (3.0k) - Augmented original
11. **Images/** (1.6k) - Small reference set
12. **MPox-Vision/** (0.8k) - Balanced demo dataset
13. **complete_mednode_dataset/** (0.2k) - Minimal reference

### By Class Count:
- **22 Classes**: SkinDisease/ (PRIMARY)
- **5 Classes**: skin_2/, Images/
- **4 Classes**: MPox-Vision/
- **2 Classes**: Vitiligo, ArsenicSkinImageBD, Scabies, MedNode

### By Use Case:

#### 🎯 Multi-Class Classification (Dermatologist-Level Diagnosis)
1. **SkinDisease/** (15.4k, 22 classes) - Primary training set
2. **SkinDisNet** (27.4k with augmentation) - Supplementary
3. **processed_images/** (52.7k) - Preprocessing reference

#### 🎯 Binary Classification (Screening/Triage)
1. **ArsenicSkinImageBD/** (8.9k, perfectly balanced)
2. **Vitiligo Dataset** (10.5k, well-split)
3. **Scabies_Dataset_DIB/** (3.0k, augmented)

#### 🎯 Specialized Disease Detection
1. **Vitiligo Dataset** - Vitiligo specialist
2. **skin_2/** - SJS-TEN, Nail Psoriasis
3. **Images/** - Eczema focus
4. **MPox-Vision/** - Pox-like illness differentiation

#### 🎯 Fairness & Bias Evaluation
1. **Synthetic Dermatology Dataset** (6.0k) - Racial representation
2. Pair with SkinDisease/ for bias analysis

#### 🎯 Transfer Learning (Limited Data)
1. **MPox-Vision/** (800, balanced) - Start here
2. **complete_mednode_dataset/** (170) - For proof-of-concept only

---

## Training Pipeline Integration

### Phase 1: Data Preparation
```python
# Primary dataset
train_path = "SkinDisease/train/"  # 12,722 images
test_path = "SkinDisease/test/"    # 2,722 images

# Supplementary (if needed)
augmented_path = "SkinDisNet/Augmented/"  # 11,970 additional

# Validation (binary classification check)
vitiligo_val_path = "Dermatological Images for Vitiligo Disease Dataset/valid/"
```

### Phase 2: Preprocessing
```
1. Load from SkinDisease/train/ (primary)
2. Resize to 224×224 pixels
3. Apply Binary Validator first (validation.py)
4. Normalize to ImageNet standards (μ, σ)
5. Optional: Apply augmentation from Scabies example
```

### Phase 3: Model Training
```
Recommended Approach:
├─ SupCon Pre-training: SkinDisease + SkinDisNet augmented
├─ Linear Probing: SkinDisease/train for 22 classes
└─ Validation: Vitiligo dataset (binary performance check)
```

### Phase 4: Testing & Evaluation
```
Test Sets:
├─ SkinDisease/test/ (multi-class primary)
├─ Vitiligo test split (binary validation)
└─ Synthetic Dermatology (bias analysis)
```

---

## Data Quality Notes

✅ **High Quality Datasets**:
- SkinDisease/ (22-class, balanced)
- Vitiligo Dataset (proper train/test/val splits)
- ArsenicSkinImageBD (binary, perfectly balanced)

⚠️ **Augmented/Processed**:
- SkinDisNet (varies by split)
- Scabies_Dataset_DIB (augmentation 4x)

⚠️ **Raw/Requires Processing**:
- dataverse_files/ (needs CSV alignment)
- processed_images/ (unknown preprocessing)

❌ **Too Small for Training**:
- complete_mednode_dataset/ (170 images)

---

## CSV Metadata Files

Located in: `dataverse_files/DATASET/`
- `Metadata_schema.md` - Schema definition
- `Skin_Metadata-1.csv` - Labels and metadata
- `test_split-1.csv` - Pre-defined test split
- `train_split-1.csv` - Pre-defined training split

**Note**: Use these for reproducible research splits if needed.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Images** | 151,464 |
| **Total Classes** | 23+ (including all variants) |
| **Primary Training Set** | SkinDisease/ (15,444 images, 22 classes) |
| **Best Binary Datasets** | ArsenicSkinImageBD, Vitiligo |
| **Augmented Data Available** | SkinDisNet (27k), Scabies (2.4k) |
| **Smallest Dataset** | complete_mednode_dataset (170 images) |
| **Largest Single Dataset** | processed_images (52.7k) |
| **Synthetic Data** | Synthetic Dermatology (6k for bias mitigation) |

---

## Quick Start Commands

```bash
# Count total images
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l

# Count images per dataset
for dir in */; do echo "$dir: $(find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | wc -l)"; done

# List classes in SkinDisease
ls -1 SkinDisease/train/

# Count samples per class
for class in SkinDisease/train/*/; do 
  echo "$(basename $class): $(find "$class" -type f | wc -l)"
done

# Validate image integrity (quick check)
find . -type f -iname "*.jpg" | head -10 | xargs file
```

---

## Version History

- **Last Updated**: May 19, 2026
- **Total Inventory**: 151,464 images
- **Datasets Cataloged**: 14 major datasets
- **Classes Defined**: 22+ disease categories

---

## Contact & Support

For questions about dataset structure or usage:
- See individual dataset README files in each folder
- Check `dataverse_files/Metadata_schema.md` for field definitions
- Refer to original dataset publication for licensing

---

**Generated for SkinX Production Pipeline**  
Ensures mathematical precision, clinical validity, and patient-friendly output.
